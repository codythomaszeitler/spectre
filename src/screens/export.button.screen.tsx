import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { PerfectSquare } from "./perfect.square";
import { Color } from "../pojo/color";
import { isMobile } from "react-device-detect";

export class ExportButtonScreen extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: new Color("#EDB373").hex(),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/download.png")}
            resizeMode="contain"
            style={{
              width: isMobile ? 15 : 25,
              height: isMobile ? 20 : 40,
            }}
          ></Image>
        </View>
      </TouchableOpacity>
    );
  }
}
