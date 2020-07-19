import React, { Component } from "react";
import { Text } from "react-native-elements";
import { PerfectCircle } from "./perfect.circle";
import {FontFamily} from '../css/styles';

export class DeleteButton extends Component {
  render() {
    return (
      <PerfectCircle
        color={this.props.color.darkerBy(1.2)}
        diameter={20}
        onPress={this.props.onPress}
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
      </PerfectCircle>
    );
  }
}
