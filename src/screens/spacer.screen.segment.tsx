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
            width : 10,
          }}
          key={this.props.uniqueKey + '' + i + '1'}
        ></View>
      );
      smallDividers.push(
        <View
          style={{
            width : 16,
          }}
          key={this.props.uniqueKey + '' + i + '2'}
        >
          <Divider style={{
              borderBottomWidth : 2,
              borderColor : "#D5D5D5",
              width : 16
          }}></Divider>
        </View>
      );
      smallDividers.push(
        <View
          style={{
            width : 10
          }}
          key={this.props.uniqueKey + '' + i + '3'}
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
