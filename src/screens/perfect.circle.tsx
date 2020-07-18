import React, { Component } from "react";
import { TouchableOpacity } from "react-native";

export class PerfectCircle extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: "rgba(255,0,0,0.2)",
          alignItems: "center",
          justifyContent: "center",
          width: 75,
          height: 75,
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
