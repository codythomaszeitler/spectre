import React, { Component } from "react";
import { View } from "react-native";
import { Image } from "react-native-elements";
import { PerfectSquare } from "./perfect.square";
import { Color } from "../pojo/color";
import { isMobile } from 'react-device-detect';

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
              width: isMobile ? 10 : 15,
              height: isMobile ? 15 : 25,
            }}
          ></Image>
        </PerfectSquare>
      </View>
    );
  }
}
