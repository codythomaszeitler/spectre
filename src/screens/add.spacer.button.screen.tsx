import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { CATEGORY_BOX_INSET } from "./category.screen";

export class AddSpacerButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: CATEGORY_BOX_INSET,
          borderWidth: 2,
          borderStyle: "dashed",
          borderColor: "#cdcdcd",
        }}
        onPress={this.props.onPress}
      ></TouchableOpacity>
    );
  }
}
