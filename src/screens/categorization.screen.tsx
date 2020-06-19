import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from "react-native";
import { Button, Icon, Card, Input, Text } from "react-native-elements";
import { datastore } from "../datastore/datastore";
import {
  SpectreUser,
  CategoryAddedListener,
  OnCategoryAddedEvent,
  OnTransactionUncategorizedEvent,
  OnCategoryRemovedEvent,
  TransactionCategorizedListener,
  OnTransactionCategorizedEvent,
} from "../pojo/spectre.user";
import { Modal } from "./modal.screen";
import { Transaction } from "../pojo/transaction";
import { CategoryScreen, OnCategoryPressed } from "./category.screen";
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
import { TransactionSaveService } from "../service/transaction.save.service";
import { CsvExporter } from "../export/csv.exporter";
import { TransactionScreenSegment } from "./transaction.screen.segment";
import { Location } from "../service/location";
import { ColumnEstimation } from "../service/column.estimation";

let CIRCLE_RADIUS = 36;

export interface Props {}

export interface State {
  categories: Category[];
  showImportCsvScreen: boolean;
  showAddCategoryScreen: boolean;
  categoryAddText: string;
  currentTransaction: Transaction;
  pan: Animated.ValueXY;
  isCategorizationMode: boolean;
}

export class CategorizationScreen extends Component
  implements
    DocumentLoadedListener,
    CategoryAddedListener,
    TransactionCategorizedListener {
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
    this.onExportCategorized = this.onExportCategorized.bind(this);
    this.onCategorizationStart = this.onCategorizationStart.bind(this);
    this.onCategorizationEnd = this.onCategorizationEnd.bind(this);

    const model = new SpectreUser();
    datastore().set(model);
    this.spectreUser = model;

    this.spectreUser.addOnCategoryAddedListener(this);
    this.spectreUser.addCategoryRemovedListener(this);

    this.state = {
      pan: new Animated.ValueXY(),
      categories: this.spectreUser.getCategories(),
      showImportCsvScreen: false,
      showAddCategoryScreen: false,
      categoryAddText: "",
      currentTransaction: undefined,
      isCategorizationMode: false,
      numUncategorized: 0,
    };

    this.categoryBoxLocations = {};
  }

  componentWillUnmount() {
    this.spectreUser.removeOnCategoryAddedListener(this);
  }

  onImportPress() {
    this.setState({
      showImportCsvScreen: true,
    });
  }

  async onExportCategorized() {
    const file = new File([], "test.csv", { type: "text/plain;charset=utf-8" });

    const location = new LocalFileLocation(file);
    const columns = new Columns({});

    const transactionSaveService = new TransactionSaveService(
      this.spectreUser,
      location,
      new CsvExporter(columns)
    );

    await transactionSaveService.save();
  }

  onAddCategoryPress(event) {
    // This function changes based on what state the screen is currently in
    if (this.state.categoryAddText) {
      const category = new Category(this.state.categoryAddText);
      this.spectreUser.addCategory(category);

      this.setState({
        showAddCategoryScreen: false,
      });
    }
  }

  onCategoryAdded(event: OnCategoryAddedEvent) {
    this.spectreUser.addTransactionCategorizedListener(event.category, this);
    this.spectreUser.addTransactionUncategorizedListener(event.category, this);
    this.setState({
      categories: this.spectreUser.getCategories(),
    });
  }

  onCategoryRemoved(event: OnCategoryRemovedEvent) {
    this.spectreUser.removeTransactionCategorizedListener(event.category, this);
    this.spectreUser.removeTransactionUncategorizedListener(
      event.category,
      this
    );
    this.setState({
      categories: this.spectreUser.getCategories(),
    });
  }

  onCategorizationStart() {
    if (this.spectreUser.getUncategorized().length !== 0) {
      this.setState({
        currentTransaction: this.spectreUser.getUncategorized().shift(),
        isCategorizationMode: true,
      });
    }
  }

  onCategorizationEnd() {
    this.setState({
      currentTransaction: null,
      isCategorizationMode: false,
    });
  }

  async onFileSelect(event: OnFileSelectedEvent) {
    const location = new LocalFileLocation(event.file);
    if (await location.isEmpty()) {
      return;
    }

    const estimator = new ColumnEstimation(location);
    const columns = await estimator.estimate();

    const loadService = new TransactionLoadService(
      this.spectreUser,
      location,
      new CsvImporter(columns)
    );
    await loadService.load();

    this.setState({
      showImportCsvScreen: false,
      numUncategorized: this.spectreUser.getUncategorized().length,
    });
  }

  onCategoryPress(event: OnCategoryPressed) {
    if (this.state.currentTransaction) {
      this.spectreUser.categorize(
        this.state.currentTransaction,
        event.category
      );

      const uncategorized = this.spectreUser.getUncategorized();
      const transaction = uncategorized.shift();

      if (transaction) {
        this.setState({
          currentTransaction: transaction,
        });
      } else {
        this.setState({
          currentTransaction: null,
          isCategorizationMode: false,
        });
      }
    }
  }

  onTransactionCategorized(event: OnTransactionCategorizedEvent) {
    this.setState({
      numUncategorized: this.spectreUser.getUncategorized().length,
    });
  }

  onTransactionUncategorized(event: OnTransactionUncategorizedEvent) {
    let currentTransaction = null;
    if (this.state.isCategorizationMode) {
      currentTransaction = this.spectreUser.getUncategorized().shift();
    }

    this.setState({
      currentTransaction: currentTransaction,
      numUncategorized: this.spectreUser.getUncategorized().length,
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
              value={this.state.categoryAddText}
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
            keyExtractor={(item, index) => {
              return item.getType(); //+ new Date().getTime().toString() + (Math.floor(Math.random() * Math.floor(new Date().getTime()))).toString()
            }}
            extraData={this.state}
            renderItem={({ item, index }) => {
              return (
                <CategoryScreen
                  color={this.colors[index % this.colors.length]}
                  category={item}
                  categorizationMode={this.state.isCategorizationMode}
                  onPress={this.onCategoryPress}
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
            flex: 0.25,
          }}
        ></View>
        {!this.state.currentTransaction && (
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
                onPress={this.onExportCategorized}
              >
                <Icon name={"chevron-right"} size={15} color="#fff" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flex: 3,
              }}
            >
              <TouchableOpacity
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
                onPress={this.onCategorizationStart}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  {this.state.numUncategorized}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.5 }}></View>
          </View>
        )}

        {this.state.currentTransaction && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ flex: 1 }}></View>
            <View
              style={{
                flex: 1,
                alignSelf: "flex-start",
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  borderColor: "rgba(255,0,0,1)",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  backgroundColor: "white",
                  borderRadius: 50,
                }}
                onPress={this.onCategorizationEnd}
              >
                <Text
                  style={{
                    color: "red",
                  }}
                >
                  -
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 8,
              }}
            >
              <TransactionScreenSegment
                canDelete={false}
                transaction={this.state.currentTransaction}
                textColor="black"
                containerStyle={{
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 5,
                  shadowOpacity: 1.0,
                  marginTop: 10,
                  paddingTop: 15,
                  paddingBottom: 15,
                  borderRadius: 7,
                  borderWidth: 0,
                }}
              ></TransactionScreenSegment>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "flex-end",
              }}
            ></View>
          </View>
        )}
        <View
          style={{
            flex: 0.25,
          }}
        ></View>
      </View>
    );
  }
}
