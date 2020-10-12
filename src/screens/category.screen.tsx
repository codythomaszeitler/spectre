import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
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
import { BoldFontFamily, FontFamily } from "../css/styles";
import { Alert } from "./alert";
import { Color } from "../pojo/color";
import { DeleteButton } from "./delete.button";
import GestureRecognizer from "react-native-swipe-gestures";
import { isMobile } from "react-device-detect";
import { EditCategoryScreen } from "./edit.category.screen";

export const CATEGORY_BOX_HEIGHT = isMobile ? 35 : 47;
export const CATEGORY_BOX_INSET = 6;
export const CATEGORY_FONT_SIZE = 21;
export const TRANSACTION_DIAMETER = CATEGORY_BOX_HEIGHT / 1.4;
export const WHITESPACE_LEFT_OF_CATEGORY_TEXT = 10 * 3 - 5;

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
  deleteButtonWidth: number;
  numTransactionsDiameter: number;
}

export class CategoryScreen
  extends Component
  implements TransactionCategorizedListener{
  state: State;
  spectreUser: SpectreUser;

  constructor(props: Props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onUncategorizePress = this.onUncategorizePress.bind(this);
    this.onCategoryDeletePress = this.onCategoryDeletePress.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.onStartEditing = this.onStartEditing.bind(this);
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
      deleteButtonWidth: CATEGORY_BOX_HEIGHT,
      numTransactionsDiameter: TRANSACTION_DIAMETER,
      cachedTransactionsView: [],
      isEditing: false,
    };
  }

  componentDidMount() {
    this.setState({
      cachedTransactionsView: this.generateTransactionsViews(),
    });
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

    this.spectreUser.removeOnCategoryNameChangeListener(this);
  }

  generateTransactionsViews() {
    const transactions = this.spectreUser.getTransactionsFor(this.props.category);
    return transactions
      .reverse()
      .map((data) => {
        return this.generateTransactionsView(data);
      });
  }

  generateTransactionsView(data) {
    return (
      <View
        key={data.id}
        style={{
          flexDirection: "row",
          flex: 1,
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
          <View
            style={{
              height: 5,
            }}
          ></View>
          <TransactionScreenSegment
            canDelete={true}
            isHorizontal
            onDelete={this.onUncategorizePress}
            transaction={data}
            textColor={new Color("#FFFFFF")}
            backgroundColor={new Color("#bdbdbd")}
            containerStyle={{
              backgroundColor: "#bdbdbd",
              borderRadius: 7,
              height: CATEGORY_BOX_HEIGHT,
            }}
            type={"row"}
          ></TransactionScreenSegment>
        </View>
      </View>
    );
  }

  onStartEditing() {
    this.setState({
      isEditing: true,
    });
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
      this.props.category
    ).length;
    this.setState(
      {
        numTransactions: numTransactions,
        category: event.category.copy(),
      },
      () => {
        this.setState({
          cachedTransactionsView: this.generateTransactionsViews(),
        });
      }
    );
  }

  onTransactionUncategorized(event: OnTransactionUncategorizedEvent) {
    const numTransactions = this.spectreUser.getTransactionsFor(
      this.props.category
    ).length;
    this.setState(
      {
        numTransactions: numTransactions,
        category: event.category.copy(),
      },
      () => {
        this.setState({
          cachedTransactionsView: this.generateTransactionsViews(),
        });
      }
    );
  }

  onPress() {
    try {
      if (!this.props.categorizationMode) {
        const flipped = !this.state.shouldShowTransactions;
        this.setState({
          shouldShowTransactions: flipped,
        });
      }

      this.props.onPress(new OnCategoryPressed(this.props.category));
    } catch (e) {
      const errorDialog = new Alert();
      errorDialog.show(e.message);
    }
  }

  onCategoryDeletePress() {
    try {
      this.spectreUser.remove(this.props.category);
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
      <View>
        {this.state.isEditing && (
          <EditCategoryScreen
            category={this.props.category}
            color={this.state.color}
            onColorChoice={(category : Category, color : Color) => {
              this.props.onColorChoice(category, color);
              this.setState({
                isEditing: false,
              });
            }}
          ></EditCategoryScreen>
        )}

        {!this.state.isEditing && (
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
                  flexShrink: 1,
                  flex: 0,
                }}
                onMouseEnter={() => {
                  this.setState({
                    showDeleteButton: true,
                  });
                }}
                onMouseLeave={() => {
                  this.setState({
                    showDeleteButton: false,
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: WHITESPACE_LEFT_OF_CATEGORY_TEXT,
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
                        fontSize: isMobile
                          ? CATEGORY_FONT_SIZE
                          : CATEGORY_FONT_SIZE + 3,
                        fontFamily: FontFamily,
                        marginBottom: 1,
                      }}
                    >
                      {this.props.category.getName()}
                    </Text>
                  </View>

                  <View
                    style={{
                      justifyContent: "flex-end",
                      width: this.state.numTransactionsDiameter,
                      height: this.state.numTransactionsDiameter,
                      backgroundColor: this.state.color.darkerBy(1.2).hex(),
                      borderRadius: this.state.numTransactionsDiameter,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        flex: 1,
                      }}
                    >
                      <Text style={styles.numTransactionCounterText}>
                        {this.state.numTransactions}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 10,
                    }}
                  ></View>
                  {this.state.showDeleteButton && (
                    <View
                      style={{
                        flexDirection: "row",
                        width: this.state.deleteButtonWidth * 2 + 5,
                        height: this.state.deleteButtonWidth,
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "flex-end",
                          width: this.state.deleteButtonWidth,
                          height: this.state.deleteButtonWidth,
                        }}
                      >
                        <DeleteButton
                          onPress={this.onStartEditing}
                          color={new Color("#fa756b")}
                          borderRadius={CATEGORY_BOX_INSET}
                        ></DeleteButton>
                      </View>
                      <View
                        style={{
                          width: 5,
                          height: 1,
                        }}
                      ></View>
                      <View
                        style={{
                          justifyContent: "flex-end",
                          width: this.state.deleteButtonWidth,
                          height: this.state.deleteButtonWidth,
                        }}
                      >
                        <DeleteButton
                          onPress={this.onDeletePress}
                          color={new Color("#fa756b")}
                          borderRadius={CATEGORY_BOX_INSET}
                        ></DeleteButton>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </GestureRecognizer>
        )}
        {!this.props.categorizationMode &&
          this.state.shouldShowTransactions &&
          this.state.cachedTransactionsView}
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

export const styles = StyleSheet.create({
  numTransactionCounterText: {
    fontFamily: BoldFontFamily,
    color: "white",
    fontSize: 17,
  },
});
