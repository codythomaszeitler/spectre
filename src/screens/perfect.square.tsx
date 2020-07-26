import React, { Component } from "react";
import { View, LayoutChangeEvent, TouchableOpacity } from "react-native";
import { getMinDimension } from "./perfect.circle";

interface Props {}

interface State {}

export class PerfectSquare extends Component {
  state: State;

  constructor(props: Props) {
    super(props);

    this.onShow = this.onShow.bind(this);

    this.state = {
      width: "100%",
    };
  }

  onShow(event: LayoutChangeEvent) {
    this.setState({
      width: getMinDimension(event),
    });
  }

  render() {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: this.props.color.hex(),
          borderColor: "#fff",
          justifyContent: "center",
          width: this.state.width,
          height: this.state.width,
          borderRadius: 10,
        }}
        onPress={this.props.onPress}
        onLayout={this.onShow}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
}
