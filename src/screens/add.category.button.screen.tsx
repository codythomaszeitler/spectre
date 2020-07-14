import React, { Component } from "react";
import { Button } from "react-native-elements";

export class AddCategoryButton extends Component {
  render() {
    return (
      <Button
        buttonStyle={{
          backgroundColor: "#ced4de",
          marginTop: 10,
          paddingTop: 15,
          paddingBottom: 15,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#fff",
        }}
        icon={{
          name: "add",
          size: 15,
          color: "white",
        }}
        onPress={this.props.onPress}
      ></Button>
    );
  }
}
