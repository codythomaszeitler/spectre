import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
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
          <Icon name={"chevron-right"} size={15} color="#fff" />
        </PerfectSquare>
      </View>
    );
  }
}
