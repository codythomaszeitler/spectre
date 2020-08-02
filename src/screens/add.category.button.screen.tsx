import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { CATEGORY_BOX_INSET } from "./category.screen";

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
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/folder.png")}
            style={{
              width: 30,
              height: 30,
            }}
          ></Image>
        </View>
      </TouchableOpacity>
    );
  }
}
