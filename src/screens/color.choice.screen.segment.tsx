import React, { Component } from "react";
import { PerfectCircle } from "./perfect.circle";

export class ColorChoiceScreenSegment extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.color);
  }

  render() {
    return (
      <PerfectCircle
        color={this.props.color.lighterBy(this.props.lightnessFactor)}
        onPress={this.onPress}
        diameter={35}
        opacity={this.props.isSelected ? 1 : 0.67}
      ></PerfectCircle>
    );
  }
}
