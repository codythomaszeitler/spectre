import React, { Component } from "react";
import { Text } from "react-native-elements";
import { TouchableOpacity } from "react-native";

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
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.2)",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: this.props.color,
          borderRadius: 50,
        }}
        onPress={this.onPress}
      >
        <Text>
          {this.props.currentSelectedColor === this.props.color ? "+" : "-"}
        </Text>
      </TouchableOpacity>
    );
  }
}
