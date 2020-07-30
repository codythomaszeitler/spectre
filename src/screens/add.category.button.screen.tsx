import React, { Component } from "react";
import { Button } from "react-native-elements";
import { CATEGORY_BOX_HEIGHT, CATEGORY_BOX_INSET } from "./category.screen";

export class AddCategoryButton extends Component {
  render() {
    return (
      <Button
        buttonStyle={{
          backgroundColor: "#cdcdcd",
          marginTop: 12,
          borderRadius: CATEGORY_BOX_INSET,
          borderWidth: 1,
          borderColor: "#fff",
          height : CATEGORY_BOX_HEIGHT,
        }}
        icon={{
          name: "add",
          size: 25,
          color: "white",
        }}
        onPress={this.props.onPress}
      ></Button>
    );
  }
}
