import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import { datastore } from "../datastore/datastore";
import { SpectreUser } from "../pojo/spectre.user";
import { TransactionDetail } from "../pojo/info.line";
import { Transaction } from "../pojo/transaction";
import { Currency } from "../pojo/currency";
import Svg, { Circle, Rect } from "react-native-svg";

export class CategorizationScreen extends Component {
  screenWidth: number;
  screenHeight: number;

  constructor(props) {
    super(props);
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.onError = this.onError.bind(this);

    const model = new SpectreUser();
    datastore().set(model);

    this.spectreUser = model;
    this.spectreUser.addTransactionReadyForCategorizationListener(this);

    this.screenWidth = Math.round(Dimensions.get("window").width);
    this.screenHeight = Math.round(Dimensions.get("window").height);
  }

  onTransactionReadyForCategorization(event) {
    console.log(event);
  }

  onFileLoaded(rows) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      console.log(row);

      const detail = new TransactionDetail(row[0], "Banking Information");
      const company = new TransactionDetail(row[2], "Business");
      const currency = new Currency(row[1]);

      const transaction = new Transaction(currency, null, [detail, company]);
      this.spectreUser.readyForCategorization(transaction);
    }
  }

  onError(event) {
    console.log(event);
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
        <View
          style={{
            alignSelf: "center",
            width: this.screenWidth * 0.8,
            flex: 8,
          }}
        >
          <Button
            buttonStyle={{
              backgroundColor: "#ced4de",
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
            justifyContent: "flex-end",
            flexDirection : 'row',
            flex : 1
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              flex : 1
            }}
          >
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
              <Rect
                x="20"
                y="20"
                width="50"
                height="50"
                strokeWidth="2"
                fill="#5ccc54"
              />
            </Svg>
          </View>
          <View style={{
            flex : 1.5
          }}>

          </View>
          <View
            style={{
              alignItems: "flex-end",
              flex : 1
            }}
          >
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="45" strokeWidth="2.5" fill="red" />
            </Svg>
          </View>
        </View>
        <View style={{
          flex : .5
        }}></View>

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
});
