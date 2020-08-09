import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
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
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: (CATEGORY_BOX_HEIGHT / 2) + 4,
              height: CATEGORY_BOX_HEIGHT / 2,
            }}
          >
            <Image
              source={require("../../assets/folder.png")}
              style={{
                width : undefined,
                height : undefined,
                flex : 1
              }}
            ></Image>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
