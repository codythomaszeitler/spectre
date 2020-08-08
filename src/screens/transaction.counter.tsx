import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { FontFamily } from "../css/styles";

export class TransactionCounter extends Component {
  // this.props.color.darkerBy(1.2)
  render() {
    return (
      <View
        style={{
          backgroundColor : this.props.color.darkerBy(1.2).hex(),
          width : this.props.diameter,
          height : this.props.diameter,
          borderRadius : 10,
          justifyContent : 'center',
        }}
      >
        <Text
          style={{
            fontFamily: FontFamily,
            color: "white",
            fontSize: 17,
            justifyContent : 'flex-end'
          }}
        >
          {this.props.numTransactions}
        </Text>
      </View>
    );
  }
}
