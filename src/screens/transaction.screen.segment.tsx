import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text, Badge } from "react-native-elements";
import { Transaction } from "../pojo/transaction";
import { FontFamily } from "../css/styles";
import { PerfectCircle } from "./perfect.circle";

export class TransactionScreenSegment extends Component {
  constructor(props) {
    super(props);
    this.onDeletePress = this.onDeletePress.bind(this);
  }

  onDeletePress(event) {
    this.props.onDelete(new TransactionDeletePress(this.props.transaction));
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Card containerStyle={this.props.containerStyle}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
            }}
          >
            <View
              style={{
                alignSelf: "flex-start",
                flex: 10,
              }}
            >
              {this.props.transaction.getDetails().map((item) => {
                return (
                  <Text
                    key={item.detail}
                    style={{
                      color: this.props.textColor,
                      fontFamily: FontFamily,
                    }}
                  >
                    {item.detail}
                  </Text>
                );
              })}
            </View>
            <View
              style={{
                alignSelf: "center",
                flex: 1,
              }}
            >
              {this.props.canDelete && (
                <TouchableOpacity onPress={this.onDeletePress}>
                  <PerfectCircle
                    color={this.props.backgroundColor.darkerBy(1.2)}
                    onPress={this.onDeletePress}
                    diameter={20}
                  >
                    <Text style={{
                      fontFamily :FontFamily,
                      fontSize : 10,
                      color : 'white'
                    }}>X</Text>
                  </PerfectCircle>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

export class TransactionDeletePress {
  transaction: Transaction;

  constructor(transaction: Transaction) {
    this.transaction = transaction.copy();
  }
}
