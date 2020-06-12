import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  PanResponder,
  Animated,
} from "react-native";
import { Button, Icon, Card, Input, Text } from "react-native-elements";
import { datastore } from "../datastore/datastore";
import {
  SpectreUser,
  CategoryAddedListener,
  OnCategoryAddedEvent,
} from "../pojo/spectre.user";
import { Modal } from "./modal.screen";
import { AMOUNT_TYPE, Transaction } from "../pojo/transaction";
import {
  CategoryScreen,
  OnCategoryPressed,
  OnLocationChange,
} from "./category.screen";
import { Category } from "../pojo/category";
import {
  DocumentPicker,
  DocumentLoadedListener,
  OnFileSelectedEvent,
} from "./document.picker.screen";
import { TransactionLoadService } from "../service/transaction.load.service";
import { LocalFileLocation } from "../service/local.file.location";
import { CsvImporter } from "../export/csv.importer";
import { Columns } from "../export/columns";
import { InvisibleBoundingBox } from "./invisible.bounding.box";

let CIRCLE_RADIUS = 36;

export interface Props {}

export interface State {
  categories: Category[];
  showImportCsvScreen: boolean;
  showAddCategoryScreen: boolean;
  categoryAddText: string;
  currentTransaction: Transaction;
}

export class CategorizationScreen extends Component
  implements DocumentLoadedListener, CategoryAddedListener {
  spectreUser: SpectreUser;
  categoryBoxLocations: {};

  colors = [
    "#80b1ff",
    "#ff8084",
    "violet",
    "#80ff8b",
    "#80ffe1",
    "#80b1ff",
    "#ff8084",
    "#ff8084",
  ];

  state: State;

  constructor(props: Props) {
    super(props);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onImportPress = this.onImportPress.bind(this);
    this.onAddCategoryPress = this.onAddCategoryPress.bind(this);
    this.onCategoryPress = this.onCategoryPress.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.onTransactionRelease = this.onTransactionRelease.bind(this);

    const model = new SpectreUser();
    datastore().set(model);
    this.spectreUser = model;

    this.spectreUser.addTransactionReadyForCategorizationListener(this);
    this.spectreUser.addOnCategoryAddedListener(this);

    this.state = {
      pan: new Animated.ValueXY(),
      categories: this.spectreUser.getCategories(),
      showImportCsvScreen: false,
      showAddCategoryScreen: false,
      categoryAddText: "",
      currentTransaction: undefined,
    };

    this.categoryBoxLocations = {};

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: Animated.event([
        null,
        {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        },
      ]),
      onPanResponderRelease: this.onTransactionRelease,
    });
  }

  componentWillUnmount() {
    this.spectreUser.removeOnCategoryAddedListener(this);
  }

  onTransactionRelease(event) {
    const px = event.nativeEvent.pageX;
    const py = event.nativeEvent.pageY;
    const width = 1;
    const height = 1;

    const box = new InvisibleBoundingBox(px, py, width, height);
    for (let categoryType in this.categoryBoxLocations) {
      const inner = this.categoryBoxLocations[categoryType];
      if (box.intersects(inner)) {
        const category = new Category(categoryType);
        this.spectreUser.categorize(this.state.currentTransaction, category);

        const transaction = this.spectreUser.getUncategorized().pop();

        if (transaction) {
          this.setState({
            currentTransaction: transaction,
          });
        }
      }
    }
    Animated.spring(this.state.pan, { toValue: { x: 0, y: 0 } }).start();
  }

  onImportPress() {
    this.setState({
      showImportCsvScreen: true,
    });
  }

  onLocationChange(event: OnLocationChange) {
    this.categoryBoxLocations[event.category.getType()] = event.box;
    console.log(this.categoryBoxLocations);
  }

  onAddCategoryPress(event) {
    if (this.state.categoryAddText) {
      const category = new Category(this.state.categoryAddText);
      this.spectreUser.addCategory(category);

      this.setState({
        showAddCategoryScreen: false,
      });
    }
  }

  onCategoryAdded(event: OnCategoryAddedEvent) {
    this.setState({
      categories: this.spectreUser.getCategories(),
    });
  }

  onTransactionReadyForCategorization() {
    if (!this.state.currentTransaction) {
      const transactions = this.spectreUser.getUncategorized();
      this.setState({
        currentTransaction: transactions.pop(),
      });
    }
  }

  async onFileSelect(event: OnFileSelectedEvent) {
    const columns = new Columns({
      0: {
        "Charge Amount": AMOUNT_TYPE,
      },
      1: {
        Bank: "Bank",
      },
      2: {
        "Place of Business": "Place of Business",
      },
    });

    const location = new LocalFileLocation(event.file);
    const loadService = new TransactionLoadService(
      this.spectreUser,
      location,
      new CsvImporter(columns)
    );
    await loadService.load();

    this.setState({
      showImportCsvScreen: false,
    });
  }

  onCategoryPress(event: OnCategoryPressed) {
    if (!this.state.currentTransaction) {
      return;
    }

    this.spectreUser.categorize(this.state.currentTransaction, event.category);
    this.setState({
      currentTransaction: undefined,
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          alignContent: "stretch",
        }}
      >
        <Modal
          isVisible={this.state.showImportCsvScreen}
          onBackdropPress={() => {
            this.setState({
              showImportCsvScreen: false,
            });
          }}
        >
          <Card>
            <DocumentPicker onSuccessfulLoadListener={this}></DocumentPicker>
          </Card>
        </Modal>
        <Modal
          isVisible={this.state.showAddCategoryScreen}
          onBackdropPress={() => {
            this.setState({
              showAddCategoryScreen: false,
            });
          }}
        >
          <Card title="Add Category">
            <Input
              placeholder="Category"
              onChangeText={(text) => {
                this.setState({
                  categoryAddText: text,
                });
              }}
            />
            <Button
              buttonStyle={{
                backgroundColor: "#ced4de",
                marginTop: 10,
                paddingTop: 15,
                paddingBottom: 15,
                marginLeft: 30,
                marginRight: 30,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#fff",
              }}
              icon={{
                name: "add",
                size: 15,
                color: "white",
              }}
              onPress={this.onAddCategoryPress}
            ></Button>
          </Card>
        </Modal>
        <View
          style={{
            flex: 8,
          }}
        >
          <FlatList
            data={this.state.categories}
            renderItem={({ item, index }) => {
              return (
                <CategoryScreen
                  color={this.colors[index % this.colors.length]}
                  category={item}
                  onPress={this.onCategoryPress}
                  onLocationChange={this.onLocationChange}
                ></CategoryScreen>
              );
            }}
          ></FlatList>
        </View>
        <View
          style={{
            justifyContent: "flex-end",
          }}
        >
          <Button
            buttonStyle={{
              backgroundColor: "#ced4de",
              marginTop: 10,
              paddingTop: 15,
              paddingBottom: 15,
              marginLeft: 30,
              marginRight: 30,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#fff",
            }}
            icon={{
              name: "add",
              size: 15,
              color: "white",
            }}
            onPress={() => {
              this.setState({
                showAddCategoryScreen: true,
              });
            }}
          ></Button>
        </View>
        <View
          style={{
            flex: 0.5,
          }}
        ></View>
        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            flex: 1,
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: 10,
                paddingTop: 15,
                paddingBottom: 15,
                marginLeft: 30,
                marginRight: 30,
                backgroundColor: "#00BCD4",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                height: 50,
              }}
              onPress={this.onImportPress}
            >
              <Icon name={"add"} size={15} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "flex-start",
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: 10,
                paddingTop: 15,
                paddingBottom: 15,
                marginLeft: 30,
                marginRight: 30,
                backgroundColor: "#00BCD4",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                width: 50,
                height: 50,
              }}
            >
              <Icon name={"chevron-right"} size={15} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              flex: 5,
            }}
          >
            {this.state.currentTransaction && (
              <Animated.View
                {...this.panResponder.panHandlers}
                style={[this.state.pan.getLayout()]}
              >
                <Card>
                  <Text> --- To Categorize ---</Text>
                  <Text>
                    {this.state.currentTransaction.getAmount().toString()}

                    {this.state.currentTransaction
                      .getDetails()
                      .map(function (item) {
                        return ", " + item.detail;
                      })}
                  </Text>
                </Card>
              </Animated.View>
            )}

            {/* <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,0,0,0.2)",
                alignItems: "center",
                justifyContent: "center",
                width: 75,
                height: 75,
                backgroundColor: "red",
                borderRadius: 50,
              }}
            >
              <Icon name={"chevron-right"} size={30} color="#fff" />
            </TouchableOpacity> */}
          </View>
          <View style={{ flex: 0.5 }}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Kohinoor Telugu",
  },
  card: {
    backgroundColor: "#fff",
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  circle: {
    backgroundColor: "#1abc9c",
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
  },
});
