import React, { Component } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { ColorChoiceScreenSegment } from "./color.choice.screen.segment";
import { Color } from "../pojo/color";
import { CategoryColors } from "../css/styles";

interface State {
  colorChoiceDiameter: number;
  emptySpaceWidth: number;
  currentlySelectedColor: Color;
}

export class ColorChoicesBar extends Component {
  colors: Array<Color>;

  state: State;

  constructor(props) {
    super(props);
    this.colors = [];

    for (let i = 0; i < CategoryColors.length; i++) {
      this.colors.push(new Color(CategoryColors[i]));
    }

    this.onLayout = this.onLayout.bind(this);
    this.onColorSelect = this.onColorSelect.bind(this);

    this.state = {
      colorChoiceDiameter: this.props.diameter,
      emptySpaceWidth: 10,
      currentlySelectedColor: this.colors[0],
    };
  }

  componentDidMount() {
    this.onColorSelect(this.state.currentlySelectedColor);
  }

  onLayout(event: LayoutChangeEvent) {
    const numColors = this.colors.length;
    const usedWithFromChoices = numColors * this.props.diameter;

    const leftoverWidth = this.props.width - usedWithFromChoices;
    const emptySpaceWidth = leftoverWidth / (numColors - 1);

    this.setState({
      colorChoiceDiameter: this.props.diameter,
      emptySpaceWidth: emptySpaceWidth,
    });
  }

  onColorSelect(color: Color) {
    this.setState(
      {
        currentlySelectedColor: color,
      },
      this.props.onColorSelect(color)
    );
  }

  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "flex-start",
          width: this.props.width,
          height: this.props.height,
        }}
        onLayout={this.onLayout}
      >
        {this.colors.map((color) => {
          let lightnessFactor = 1.35;
          if (color.equals(this.state.currentlySelectedColor)) {
            lightnessFactor = 1;
          }

          return (
            <View
              key={color.hex()}
              style={{
                width:
                  this.state.colorChoiceDiameter + this.state.emptySpaceWidth,
                height: this.props.height,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: this.state.colorChoiceDiameter,
                  height: this.state.colorChoiceDiameter,
                }}
              >
                <ColorChoiceScreenSegment
                  onPress={this.onColorSelect}
                  lightnessFactor={lightnessFactor}
                  color={color}
                  currentSelectedColor={this.state.color}
                  isSelected={lightnessFactor === 1}
                ></ColorChoiceScreenSegment>
              </View>
              <View
                style={{
                  width: this.state.emptySpaceLength,
                  height: this.state.emptySpaceLength,
                  backgroundColor: "black",
                }}
              ></View>
            </View>
          );
        })}
      </View>
    );
  }
}
