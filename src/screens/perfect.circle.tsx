import React, { Component } from "react";
import { Text, View, TouchableOpacity, LayoutChangeEvent } from "react-native";

interface Props {}

interface State {
  diameter: number;
  showCircle: boolean;
}

export class PerfectCircle extends Component {
  state: State;

  constructor(props: Props) {
    super(props);

    this.onShow = this.onShow.bind(this);

    this.state = {
      diameter: '100%',
      showCircle: false,
    };
  }

  onShow(event: LayoutChangeEvent) {
    if (this.props.diameter) {
      this.setState({
        diameter: this.props.diameter,
      });
      return;
    }

    this.setState({
      diameter: getMinDimension(event),
      showCircle: true,
    });
  }

  render() {
    return (
      <TouchableOpacity
        style={{
          borderColor: (this.props.borderColor ? this.props.borderColor.hex() : this.props.color.hex()),
          backgroundColor: this.props.color.hex(),
          width : this.state.diameter,
          height : this.state.diameter,
          borderRadius : this.state.diameter / 2,
          opacity : this.props.opacity
        }}
        onPress={this.props.onPress}
        onLayout={this.onShow}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent : 'center',
            flex : 1,
          }}
        >
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
}

export function getMinDimension(event : LayoutChangeEvent) {
  const flexBoxWidth = event.nativeEvent.layout.width;
  const flexBoxHeight = event.nativeEvent.layout.height;

  let minimumDimension;
  if (flexBoxHeight > flexBoxWidth) {
    minimumDimension = flexBoxWidth;
  } else if (flexBoxHeight < flexBoxWidth) {
    minimumDimension = flexBoxHeight;
  } else {
    minimumDimension = flexBoxHeight;
  }

  return minimumDimension;
}
