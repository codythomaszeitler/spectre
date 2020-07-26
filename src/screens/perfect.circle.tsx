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

    this.onWithoutCircleShowing = this.onWithoutCircleShowing.bind(this);

    this.state = {
      diameter: 0,
      showCircle: false,
    };
  }

  onWithoutCircleShowing(event: LayoutChangeEvent) {
    console.log("we are in hereerererererererereee");
    if (this.props.diameter) {
      console.log("we incorreclty got in here");
      this.setState({
        diameter: this.props.diameter,
      });
      return;
    }

    const flexBoxWidth = event.nativeEvent.layout.width;
    const flexBoxHeight = event.nativeEvent.layout.height;

    let diameter;
    if (flexBoxHeight > flexBoxWidth) {
      diameter = flexBoxWidth;
    } else if (flexBoxHeight < flexBoxWidth) {
      diameter = flexBoxHeight;
    } else {
      diameter = flexBoxHeight;
    }

    this.setState({
      diameter: diameter,
      showCircle: true,
    });
    console.log(diameter);
  }

  render() {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: this.props.color.hex(),
          backgroundColor: this.props.color.hex(),
          width : '100%',
          height : '100%',
          alignItems : 'center'
        }}
        onPress={this.props.onPress}
        onLayout={(event) => {
          console.log(event);
        }}
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
