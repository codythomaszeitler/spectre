import React, { Component } from "react";
import { TouchableOpacity } from "react-native";

export class PerfectCircle extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: this.props.color.hex(),
          alignItems: "center",
          justifyContent: "center",
          width: this.props.diameter,
          height: this.props.diameter,
          backgroundColor: this.props.color.hex(),
          borderRadius: 50,
        }}
        onPress={this.props.onPress}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
