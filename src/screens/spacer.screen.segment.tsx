import React, { Component } from "react";
import { View } from "react-native";
import { Divider } from "react-native-elements";

export class SpacerScreenSegment extends Component {
  dividers() {
    const smallDividers = [];
    for (let i = 0; i < this.props.numSmallDividers; i++) {
      smallDividers.push(
        <View
          style={{
            flex: 1,
          }}
        ></View>
      );
      smallDividers.push(
        <View
          style={{
            flex: 3,
          }}
        >
          <Divider style={{
              borderBottomWidth : 2,
              borderColor : "#B6B3AE"
          }}></Divider>
        </View>
      );
      smallDividers.push(
        <View
          style={{
            flex: 1,
          }}
        ></View>
      );
    }

    return smallDividers;
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 15,
          }}
        ></View>

        {this.dividers()}

        <View
          style={{
            flex: 15,
          }}
        ></View>
      </View>
    );
  }
}
