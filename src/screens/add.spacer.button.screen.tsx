import React, { Component } from "react";
import { Button } from "react-native-elements";

export class AddSpacerButton extends Component {
  render() {
    return (
      <Button
        buttonStyle={{
          backgroundColor: "white",
          marginTop: 10,
          paddingTop: 15,
          paddingBottom: 15,
          marginLeft: 30,
          marginRight: 30,
          borderRadius: 10,
          borderWidth: 1,
          borderStyle : 'dashed',
          borderColor: "gray",
        }}
        icon={{
          name: "add",
          size: 15,
          color: "gray",
        }}
        onPress={this.props.onPress}
      ></Button>
    );
  }
}
