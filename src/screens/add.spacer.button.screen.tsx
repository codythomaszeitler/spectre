import React, { Component } from "react";
import { Button } from "react-native-elements";

export class AddSpacerButton extends Component {
  render() {
    return (
      <Button
        buttonStyle={{
          backgroundColor: "white",
          marginTop: 13,
          paddingTop: 10,
          paddingBottom: 6,
          borderRadius: 10,
          borderWidth: 2,
          borderStyle : 'dashed',
          borderColor: "#cdcdcd",
        }}
        icon={{
          name: "add",
          size: 25,
          color: "gray",
        }}
        onPress={this.props.onPress}
      ></Button>
    );
  }
}
