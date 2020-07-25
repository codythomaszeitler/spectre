import React, { Component } from "react";
import { Textfit } from "react-textfit";

export class Text extends Component {
  render() {
    return (
      <Textfit
        mode="single"
        forceSingleModeWidth={false}
        style={this.props.style}
        width={75}
        min={30}
        max={this.props.style.fontSize}
      >
        {this.props.text}
      </Textfit>
    );
  }
}
