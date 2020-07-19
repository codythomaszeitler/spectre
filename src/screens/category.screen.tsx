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
import {
  TransactionScreenSegment,
  TransactionDeletePress,
} from "./transaction.screen.segment";
import { FontFamily } from "../css/styles";
import { Alert } from "./alert";
import { Color } from "../pojo/color";
import { PerfectCircle } from "./perfect.circle";

export const CATEGORY_BOX_HEIGHT = 50;
export const CATEGORY_BOX_INSET = 7;
export const CATEGORY_FONT_SIZE = 20;

export interface Props {
  color: Color;
  category: Category;
  categorizationMode: boolean;
  onPress: (event: OnCategoryPressed) => void;
}

export interface State {
  color: Color;
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
      shouldShowTransactions: false,
    };
  }

  componentWillUnmount() {
    this.spectreUser.removeTransactionCategorizedListener(
      this.props.category,
      this
    );
    this.spectreUser.removeTransactionUncategorizedListener(
      this.props.category,
      this
    );
  }

  onDeletePress() {
    try {
      this.spectreUser.removeCategory(this.props.category);
    } catch (e) {
      const errorDialog = new Alert();
      errorDialog.show(e.message);
    }
  }

  onUncategorizePress(event: TransactionDeletePress) {
    try {
      this.spectreUser.uncategorize(event.transaction, this.props.category);
    } catch (e) {
      const errorDialog = new Alert();
      errorDialog.show(e.message);
    }
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
    try {
      if (!this.props.categorizationMode) {
        const flipped = !this.state.shouldShowTransactions;
        this.setState({
          shouldShowTransactions: flipped,
        });
      }

      this.props.onPress(new OnCategoryPressed(this.state.category));
    } catch (e) {
      const errorDialog = new Alert();
      errorDialog.show(e.message);
    }
  }

  onCategoryDeletePress() {
    try {
      this.spectreUser.remove(this.state.category);
    } catch (e) {
      const errorDialog = new Alert();
      errorDialog.show(e.message);
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <View
            style={{
              flexBasis: CATEGORY_BOX_HEIGHT,
              borderRadius: CATEGORY_BOX_INSET,
              backgroundColor: this.state.color.hex(),
              justifyContent: "center",
              flexGrow: 1,
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View style={{
                flex : .75
              }}>

              </View>
              <View
                style={{
                  flex: 10,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: CATEGORY_FONT_SIZE,
                    fontFamily: FontFamily,
                  }}
                >
                  {this.state.category.getType()}
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "flex-end",
                  flex: 1,
                }}
              >
                <PerfectCircle
                  color={this.state.color.darkerBy(1.2)}
                  diameter={30}
                >
                  <Text
                    style={{
                      fontFamily: FontFamily,
                      color: "white",
                    }}
                  >
                    {this.state.numTransactions}
                  </Text>
                </PerfectCircle>
              </View>

              <View style={{
                justifyContent : 'flex-end',
                flex : .5
              }}>
                <PerfectCircle
                  color={this.state.color.darkerBy(1.2)}
                  diameter={20}
                  onPress={this.onDeletePress}
                >
                  <Text
                    style={{
                      fontFamily: FontFamily,
                      color: "white",
                      fontSize : 12
                    }}
                  >
                    {"X"}
                  </Text>
                </PerfectCircle>
              </View>
            </View>
          </View>
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
                    backgroundColor={this.state.color}
                    containerStyle={{
                      backgroundColor: this.state.color.hex(),
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

export class CategoryScreenSkeleton extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: this.props.color.hex(),
        }}
      >
        {this.props.children}
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
