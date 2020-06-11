import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { Button, Icon, Card } from "react-native-elements";
import { datastore } from "../datastore/datastore";
import {
  SpectreUser,
  CategoryAddedListener,
  OnCategoryAddedEvent,
} from "../pojo/spectre.user";
import { Modal } from "./modal.screen";
import { Transaction, AMOUNT_TYPE } from "../pojo/transaction";
import { Currency } from "../pojo/currency";
import { CategoryScreen } from "./category.screen";
import { Category } from "../pojo/category";
import { DocumentPicker, DocumentLoadedListener, OnFileSelectedEvent} from "./document.picker.screen";
import { TransactionLoadService } from "../service/transaction.load.service";
import { LocalFileLocation } from "../service/local.file.location";
import { CsvImporter } from "../export/csv.importer";
import { Columns } from "../export/columns";

export interface Props {

}

export interface State { 
  categories: Category[],
  screenWidth: number, 
  screenHeight: number,
  showImportCsvScreen: boolean
}

export class CategorizationScreen extends Component implements DocumentLoadedListener, CategoryAddedListener {
  spectreUser: SpectreUser;

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

  state : State;

  constructor(props : Props) {
    super(props);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onImportPress = this.onImportPress.bind(this);

    const model = new SpectreUser();
    datastore().set(model);
    this.spectreUser = model;

    for (let i = 0; i < 10; i++) {
      const category: Category = new Category("Home");
      this.spectreUser.addCategory(category);
    }

    this.spectreUser.categorize(
      new Transaction(new Currency(400, "USD")),
      new Category("Home")
    );

    this.spectreUser.addTransactionReadyForCategorizationListener(this);
    this.spectreUser.addOnCategoryAddedListener(this);

    this.state = {
      categories: this.spectreUser.getCategories(),
      screenWidth: Math.round(Dimensions.get("window").width),
      screenHeight: Math.round(Dimensions.get("window").height),
      showImportCsvScreen: false,
    };
  }

  componentWillUnmount() {
    this.spectreUser.removeOnCategoryAddedListener(this);
  }

  onImportPress() {
    this.setState({
      showImportCsvScreen : true
    })
  }

  onCategoryAdded(event: OnCategoryAddedEvent) {
    this.setState({
      categories: this.spectreUser.getCategories(),
    });
  }

  onTransactionReadyForCategorization(event) {
    console.log(event);
  }

  async onFileSelect(event: OnFileSelectedEvent) {

    const columns = new Columns({
      0 : {
        "Charge Amount": AMOUNT_TYPE,
      }, 
      1 : {
        "Bank" : "Bank"
      },
      2 : {
        "Place of Business" : "Place of Business"
      }
    });

    const location = new LocalFileLocation(event.file);
    const loadService = new TransactionLoadService(this.spectreUser, location, new CsvImporter(columns));
    await loadService.load();

    this.setState({
      showImportCsvScreen : false 
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
        <Modal isVisible={this.state.showImportCsvScreen} onBackdropPress={() => {
          this.setState({
            showImportCsvScreen : false 
          });
        }}>
          <Card>
            <DocumentPicker onSuccessfulLoadListener={this}></DocumentPicker>
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
              flex: 3,
            }}
          ></View>
          <View
            style={{
              alignItems: "flex-end",
              flex: 1,
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
            >
              <Icon name={"chevron-right"} size={30} color="#fff" />
            </TouchableOpacity>
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
});
