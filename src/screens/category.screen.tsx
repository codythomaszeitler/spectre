import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Badge, Card, Text } from "react-native-elements";
import { Category } from "../pojo/category";
import {
  SpectreUser,
  TransactionCategorizedListener,
  OnTransactionCategorizedEvent,
  OnTransactionUncategorizedEvent,
} from "../pojo/spectre.user";
import { datastore } from "../datastore/datastore";
import { InvisibleBoundingBox } from "./invisible.bounding.box";
import {
  TransactionScreenSegment,
  TransactionDeletePress,
} from "./transaction.screen.segment";

export interface Props {
  color: string;
  category: Category;
  categorizationMode: boolean;
  onPress: (event: OnCategoryPressed) => void;
}

export interface State {
  color: string;
  category: Category;
  numTransactions: number;
  shouldShowTransactions: boolean;
}

export class CategoryScreen extends Component
  implements TransactionCategorizedListener {
  state: State;
  spectreUser: SpectreUser;

  constructor(props: Props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onUncategorizePress = this.onUncategorizePress.bind(this);
    this.onCategoryDeletePress = this.onCategoryDeletePress.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.spectreUser = datastore().get();

    this.spectreUser.addTransactionCategorizedListener(props.category, this);
    this.spectreUser.addTransactionUncategorizedListener(props.category, this);

    this.state = {
      color: props.color,
      category: props.category,
      numTransactions: props.category.getTransactions().length,
    };
  }

  componentWillUnmount() {
    this.spectreUser.removeTransactionCategorizedListener(this.props.category, this);
    this.spectreUser.removeTransactionUncategorizedListener(
      this.props.category,
      this
    );
  }

  onDeletePress() {
    this.spectreUser.removeCategory(this.props.category);
  }

  onUncategorizePress(event: TransactionDeletePress) {
    this.spectreUser.uncategorize(event.transaction, this.props.category);
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

  onTransactionUncategorized(event: OnTransactionUncategorizedEvent) {
    const numTransactions = this.spectreUser.getTransactionsFor(
      this.state.category
    ).length;
    this.setState({
      numTransactions: numTransactions,
      category: event.category.copy(),
    });
  }

  onPress() {
    if (!this.props.categorizationMode) {
      const flipped = !this.state.shouldShowTransactions;
      this.setState({
        shouldShowTransactions: flipped,
      });
    }

    this.props.onPress(new OnCategoryPressed(this.state.category));
  }

  onCategoryDeletePress() {
    this.spectreUser.remove(this.state.category);
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
                  flex: 5,
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
                  flex: 2,
                }}
              >
                <Badge
                  value={this.state.numTransactions}
                  badgeStyle={{
                    backgroundColor: this.state.color,
                  }}
                />
              </View>
              <View
                style={{
                  justifyContent: "flex-end",
                  flex: 2,
                }}
              >
                <TouchableOpacity
                  onPress={this.onDeletePress}
                >
                  <Badge
                    value="X"
                    badgeStyle={{
                      backgroundColor: this.state.color,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
        {!this.props.categorizationMode &&
          this.state.shouldShowTransactions &&
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
                    canDelete={true}
                    onDelete={this.onUncategorizePress}
                    transaction={data}
                    textColor="white"
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
