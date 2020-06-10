import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Header } from "react-native-elements";
import CSVReader from "react-csv-reader";
import { datastore } from "../datastore/datastore";
import { SpectreUser } from "../pojo/spectre.user";
import { TransactionDetail } from "../pojo/info.line";
import {Transaction} from '../pojo/transaction';
import { Currency } from "../pojo/currency";

export class CategorizationScreen extends Component {
  constructor(props) {
    super(props);
    this.onFileLoaded = this.onFileLoaded.bind(this);
    this.onError = this.onError.bind(this);

    const model = new SpectreUser();
    datastore().set(model);

    this.spectreUser = model;
    this.spectreUser.addTransactionReadyForCategorizationListener(this);
  }

  onTransactionReadyForCategorization(event) {
    console.log(event);
  }

  onFileLoaded(rows) {
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        console.log(row);


        const detail = new TransactionDetail(row[0], 'Banking Information');
        const company = new TransactionDetail(row[2], 'Business');
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
        <Header
          leftComponent={{ icon: "menu", color: "#fff" }}
          centerComponent={{
            text: "Spectre",
            style: { color: "#fff" },
          }}
          rightComponent={{ icon: "home", color: "#fff" }}
        />
        <View
          style={{
            flex: 1,
          }}
        ></View>
        <View
          style={{
            flex: 5,
          }}
        >
          <Card
            containerStyle={{
              backgroundColor: "#77c98d",
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 0.5,
            }}
          >
            <Text style={styles.text}>Home</Text>
          </Card>
        </View>
        <View
          style={{
            flex: 5,
          }}
        >
          <Card
            containerStyle={{
              backgroundColor: "#9cbbe6",

              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 0.5,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.text}>Auto</Text>
            </View>
          </Card>
        </View>
        <View
          style={{
            flex: 5,
          }}
        >
          <Card
            containerStyle={{
              backgroundColor: "#f2a2f5",

              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 0.5,
            }}
          >
            <Text style={styles.text}>Insurance</Text>
          </Card>
        </View>
        <View
          style={{
            flex: 5,
          }}
        >
          <Card
            containerStyle={{
              backgroundColor: "#f5ada2",
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 0.5,
            }}
          >
            <Text style={styles.text}>Stock Market</Text>
          </Card>
        </View>
        <View
          style={{
            flex: 5,
          }}
        >
          <Card
            containerStyle={{
              backgroundColor: "#00ada2",
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 0.5,
            }}
          >
            <Text style={styles.text}>Stock Market</Text>
          </Card>
        </View>
        <View
          style={{
            flex: 5,
          }}
        >
          <Card
            containerStyle={{
              backgroundColor: "#f500a2",
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowRadius: 5,
              shadowOpacity: 0.5,
            }}
          >
            <Text style={styles.text}>Stock Market</Text>
          </Card>
        </View>

        <View style={{ flex: 1, alignSelf: "center" }}>
          <CSVReader
            cssClass="csv-reader-input"
            label="Select CSV with secret Death Star statistics"
            onFileLoaded={this.onFileLoaded}
            onError={this.onError}
            inputStyle={{ color: "red" }}
          />
        </View>
        <View style={{ flex: 10 }}></View>
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
