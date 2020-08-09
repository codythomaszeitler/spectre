import React, { Component } from "react";
import { Image, View } from "react-native";
import { Text } from "react-native-elements";
import { PerfectSquare } from "./perfect.square";
import { FontFamily } from "../css/styles";
import { isMobile } from "react-device-detect";

export class DeleteButton extends Component {
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
          color={this.props.color.darkerBy(1.2)}
          borderRadius={this.props.borderRadius}
        >
          <Image
            source={require("../../assets/x-delete.png")}
            resizeMode='contain'
            resizeMethod='resize'
            style={{
              width: isMobile ? 10 : 13,
              height: isMobile ? 15 : 17,
            }}
          ></Image>
        </PerfectSquare>
      </View>
    );
  }
}
