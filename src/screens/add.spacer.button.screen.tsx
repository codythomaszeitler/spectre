import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { CATEGORY_BOX_INSET } from "./category.screen";
import { Image } from "react-native";

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
              width: "50%",
              height: "50%",
            }}
          >
            <Image
              source={require("../../assets/plus.png")}
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
