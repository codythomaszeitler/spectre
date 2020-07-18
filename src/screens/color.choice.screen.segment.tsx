import React, { Component } from "react";
import { Text } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { PerfectCircle } from "./perfect.circle";

export class ColorChoiceScreenSegment extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.color);
  }

  render() {
    return (
      <PerfectCircle color={this.props.color} onPress={this.onPress} diameter={30}>
        <Text>
          {this.props.currentSelectedColor === this.props.color ? "+" : "-"}
        </Text>
      </PerfectCircle>
    );
  }
}
