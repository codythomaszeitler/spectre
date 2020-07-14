import React, { Component } from "react";
import { View } from "react-native";
import { AddSpacerButton } from "./add.spacer.button.screen";
import { AddCategoryButton } from "./add.category.button.screen";

export class AddSpacerOrCategoryScreen extends Component {
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
            flex: 1,
          }}
        ></View>
        <View
          style={{
            flex: 3,
          }}
        >
          <AddSpacerButton
            onPress={this.props.onSpacerAddPress}
          ></AddSpacerButton>
        </View>
        <View
          style={{
            flex: 7,
          }}
        >
          <AddCategoryButton
            onPress={this.props.onCategoryAddPress}
          ></AddCategoryButton>
        </View>
        <View
          style={{
            flex: 1,
          }}
        ></View>
      </View>
    );
  }
}
