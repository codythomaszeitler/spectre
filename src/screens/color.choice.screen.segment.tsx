import React, { Component } from "react";
import {Button} from 'react-native-elements';

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
        <Button buttonStyle={{
            backgroundColor : this.props.color,
            borderColor : '#7CFC00'
        }}
        onPress={this.onPress}
        
        title={(this.props.currentSelectedColor === this.props.color) ? 'X' : '-'}
        ></Button>
    );
  }
}
