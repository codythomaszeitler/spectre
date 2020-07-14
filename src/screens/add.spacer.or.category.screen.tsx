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
            flex: 2,
          }}
        >
          <AddSpacerButton
            onPress={this.props.onSpacerAddPress}
          ></AddSpacerButton>
        </View>
        <View style={{
          flex : .25
        }}></View>
        <View
          style={{
            flex: 8,
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
