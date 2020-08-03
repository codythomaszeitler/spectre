import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
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
import { BoldFontFamily } from "../css/styles";
import { Alert } from "./alert";
import { Color } from "../pojo/color";
import { DeleteButton } from "./delete.button";
import { TransactionCounter } from "./transaction.counter";
import GestureRecognizer from "react-native-swipe-gestures";

export const CATEGORY_BOX_HEIGHT = 47;
export const CATEGORY_BOX_INSET = 6;
export const CATEGORY_FONT_SIZE = 21;

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
  showDeleteButton: boolean;
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
    this.showDeleteButton = this.showDeleteButton.bind(this);
    this.hideDeleteButton = this.hideDeleteButton.bind(this);
    this.onLongPressShowHideDeleteButton = this.onLongPressShowHideDeleteButton.bind(
      this
    );
    this.spectreUser = datastore().get();

    this.spectreUser.addTransactionCategorizedListener(props.category, this);
    this.spectreUser.addTransactionUncategorizedListener(props.category, this);

    this.state = {
      color: props.color,
      category: props.category,
      numTransactions: props.category.getTransactions().length,
      shouldShowTransactions: false,
      showDeleteButton: false,
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

  showDeleteButton() {
    this.setState({
      showDeleteButton: true,
    });
  }

  hideDeleteButton() {
    this.setState({
      showDeleteButton: false,
    });
  }

  onLongPressShowHideDeleteButton() {
    this.setState({
      showDeleteButton: !this.state.showDeleteButton,
    });
  }

  render() {
    return (
      <View onMouseEnter={() => {
        this.setState({
          showDeleteButton : true
        });
      }}
      onMouseLeave={() => {
        this.setState({
          showDeleteButton : false
        });
      }} 
      >
        <GestureRecognizer
          onSwipeLeft={this.showDeleteButton}
          onSwipeRight={this.hideDeleteButton}
        >
          <TouchableOpacity
            onPress={this.onPress}
            onLongPress={this.onLongPressShowHideDeleteButton}
          >
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
                <View
                  style={{
                    flex: 0.45,
                  }}
                ></View>
                <View
                  style={{
                    flex: 18.5,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: CATEGORY_FONT_SIZE + 3,
                      fontFamily: BoldFontFamily,
                      marginBottom: 1,
                    }}
                  >
                    <b>{this.state.category.getType()}</b>
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: "flex-end",
                    flex: 1,
                  }}
                >
                  <TransactionCounter
                    color={this.state.color}
                    numTransactions={this.state.numTransactions}
                  ></TransactionCounter>
                </View>

                {this.state.showDeleteButton && (
                  <View
                    style={{
                      justifyContent: "flex-end",
                      flex: 1,
                    }}
                  >
                    <DeleteButton
                      onPress={this.onDeletePress}
                      color={new Color("#fa756b")}
                      diameter={25}
                    ></DeleteButton>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </GestureRecognizer>
        {!this.props.categorizationMode &&
          this.state.shouldShowTransactions &&
          this.state.category
            .getTransactions()
            .reverse()
            .map((data, index) => {
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
                      isHorizontal
                      onDelete={this.onUncategorizePress}
                      transaction={data}
                      textColor={new Color("#FFFFFF")}
                      backgroundColor={new Color("#bdbdbd")}
                      containerStyle={{
                        backgroundColor: "#bdbdbd",
                        marginTop: 5,
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
