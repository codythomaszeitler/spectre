import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { CATEGORY_BOX_INSET, CATEGORY_BOX_HEIGHT } from "./category.screen";

export class AddCategoryButton extends Component {
  render() {
    return (
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#cdcdcd",
            borderRadius: CATEGORY_BOX_INSET,
            borderColor: "#fff",
          }}
          onPress={this.props.onPress}
        ></TouchableOpacity>
    );
  }
}
