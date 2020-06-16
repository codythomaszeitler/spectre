import React, { Component } from "react";
import { View } from "react-native";
import { Card, Text, Button } from "react-native-elements";
import { Transaction } from "../pojo/transaction";

export class TransactionScreenSegment extends Component {
  constructor(props) {
    super(props);
    this.onDeletePress = this.onDeletePress.bind(this);
  }

  onDeletePress(event) {
    this.props.onDelete(new TransactionDeletePress(props.transaction));
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
                  }}
                >
                  {item.detail}
                </Text>
              );
            })}
          </View>
          <View
            style={{
              alignSelf: "flex-end",
              flex: 1,
            }}
          >
            {this.props.canDelete && (
              <Button title="X" onPress={this.onDeletePress}></Button>
            )}
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
