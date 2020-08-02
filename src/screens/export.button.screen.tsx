import React, { Component } from "react";
import { View } from "react-native";
import { Image } from "react-native-elements";
import { PerfectSquare } from "./perfect.square";
import { Color } from "../pojo/color";

export class ExportButtonScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <PerfectSquare
          onPress={this.props.onPress}
          color={new Color("#EDB373")}
          borderRadius={this.props.borderRadius}
        >
            <Image
              source={require("../../assets/download.png")}
              style={{
                width: 15,
                height: 25,
              }}
            ></Image>
        </PerfectSquare>
      </View>
    );
  }
}
