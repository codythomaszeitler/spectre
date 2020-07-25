import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

export class ExportButtonScreen extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          marginTop: 10,
          paddingTop: 15,
          paddingBottom: 15,
          marginLeft: 30,
          marginRight: 30,
          backgroundColor: "#DA9F1F",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          width: 50,
          height: 50,
        }}
        onPress={this.props.onPress}
      >
        <Icon name={"chevron-right"} size={15} color="#fff" />
      </TouchableOpacity>
    );
  }
}
