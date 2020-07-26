import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

export class ExportButtonScreen extends Component {
  render() {
    return (
        <TouchableOpacity
          style={{
            backgroundColor: "#DA9F1F",
            borderColor: "#fff",
            justifyContent : 'center',
            width : '100%',
            height : '100%',
            borderRadius : 10
          }}
          onPress={this.props.onPress}
        >
          <Icon name={"chevron-right"} size={15} color="#fff" />
        </TouchableOpacity>
    );
  }
}
