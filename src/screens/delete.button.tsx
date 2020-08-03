import React, { Component } from "react";
import { Text } from "react-native-elements";
import { PerfectSquare } from "./perfect.square";
import {FontFamily} from '../css/styles';

export class DeleteButton extends Component {
  render() {
    return (
      <PerfectSquare
        color={this.props.color.darkerBy(1.2)}
        onPress={this.props.onPress}
        borderRadius={this.props.borderRadius}
      >
        <Text
          style={{
            fontFamily: FontFamily,
            color: "white",
            fontSize: 10,
          }}
        >
          {"X"}
        </Text>
      </PerfectSquare>
    );
  }
}
