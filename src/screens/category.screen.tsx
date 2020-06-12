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

export interface Props {
  color: string;
  category: Category;
  onPress: (event: OnCategoryPressed) => void;
  onLocationChange: (event: OnLocationChange) => void;
}

export interface State {
  color: string;
  category: Category;
  numTransactions: number;
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

  componentDidMount() {
    this.updateLocation();
  }

  componentDidUpdate() {
    this.updateLocation();
  }

  updateLocation() {
    this.myComponent.measure(
      (
        fx: number,
        fy: number,
        width: number,
        height: number,
        px: number,
        py: number
      ) => {
        const box = new InvisibleBoundingBox(px, py, width, height);

        const event = new OnLocationChange(this.state.category, box);
        this.props.onLocationChange(event);
      }
    );
  }

  onTransactionCategorized(event: OnTransactionCategorizedEvent) {
    const numTransactions = this.spectreUser.getTransactionsFor(
      this.state.category
    ).length;
    this.setState({
      numTransactions: numTransactions,
    });
  }

  onPress() {
    this.props.onPress(new OnCategoryPressed(this.state.category));
  }

  render() {
    return (
      <View
        onResponderRelease={(event) => {
          console.log(event);
        }}
        ref={(view) => {
          this.myComponent = view;
        }}
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

          <View
            style={{
              alignSelf: "flex-end",
            }}
          >
            {this.state.category.getTransactions().map((data, index) => {
              return (
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
                  <Text>{data.getAmount().toString()}</Text>
                </Card>
              );
            })}
          </View>
        </TouchableOpacity>
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
