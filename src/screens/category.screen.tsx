import React, { Component } from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";
import { Badge, Card, Text } from "react-native-elements";
import { Category } from "../pojo/category";
import {
  SpectreUser,
  TransactionCategorizedListener,
  OnTransactionCategorizedEvent,
} from "../pojo/spectre.user";
import { datastore } from "../datastore/datastore";
import { InvisibleBoundingBox } from "./invisible.bounding.box";
import { TransactionScreenSegment } from "./transaction.screen.segment";

export interface Props {
  color: string;
  category: Category;
  categorizationMode: boolean;
  onPress: (event: OnCategoryPressed) => void;
  onLocationChange: (event: OnLocationChange) => void;
}

export interface State {
  color: string;
  category: Category;
  numTransactions: number;
  shouldShowTransactions : boolean;
}

export class CategoryScreen extends Component
  implements TransactionCategorizedListener {
  state: State;
  spectreUser: SpectreUser;

  constructor(props: Props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.spectreUser = datastore().get();

    this.spectreUser.addTransactionCategorizedListener(props.category, this);

    this.state = {
      color: props.color,
      category: props.category,
      numTransactions: props.category.getTransactions().length,
    };
  }

  onTransactionCategorized(event: OnTransactionCategorizedEvent) {
    const numTransactions = this.spectreUser.getTransactionsFor(
      this.state.category
    ).length;
    this.setState({
      numTransactions: numTransactions,
      category: event.category.copy(),
    });
  }

  onPress() {
    console.log(this.props);
    if (!this.props.categorizationMode) {
      const flipped = !this.state.shouldShowTransactions;
      console.log(flipped);
      this.setState({
        shouldShowTransactions : flipped
      });
    }

    this.props.onPress(new OnCategoryPressed(this.state.category));
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <TouchableOpacity onPress={this.onPress}>
          <Card
            containerStyle={{
              backgroundColor: this.state.color,
              marginTop: 10,
              paddingTop: 15,
              paddingBottom: 15,
              borderRadius: 7,
              borderWidth: 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
              }}
            >
              <View
                style={{
                  justifyContent: "flex-start",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 15,
                  }}
                >
                  {this.state.category.getType()}
                </Text>
              </View>

              <View
                style={{
                  flex: 5,
                }}
              ></View>
              <View
                style={{
                  justifyContent: "flex-end",
                  flex: 1,
                }}
              >
                <Badge
                  value={this.state.numTransactions}
                  badgeStyle={{
                    backgroundColor: this.state.color,
                  }}
                />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
        {(!this.props.categorizationMode && this.state.shouldShowTransactions) &&
          this.state.category.getTransactions().map((data, index) => {
            return (
              <View
                key={data.id}
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                ></View>
                <View
                  style={{
                    flex: 9,
                  }}
                >
                  <TransactionScreenSegment
                    transaction={data}
                    textColor='white'
                    containerStyle={{
                      backgroundColor: this.state.color,
                      marginTop: 10,
                      paddingTop: 15,
                      paddingBottom: 15,
                      borderRadius: 7,
                      borderWidth: 0,
                    }}
                    type={"row"}
                  ></TransactionScreenSegment>
                </View>
              </View>
            );
          })}
      </View>
    );
  }
}

export class OnCategoryPressed {
  category: Category;

  constructor(category: Category) {
    this.category = category.copy();
  }
}

export class OnLocationChange {
  box: InvisibleBoundingBox;
  category: Category;

  constructor(category: Category, box: InvisibleBoundingBox) {
    this.category = category.copy();
    this.box = box.copy();
  }
}
