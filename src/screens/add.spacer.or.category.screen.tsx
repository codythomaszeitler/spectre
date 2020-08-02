import React, { Component } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { AddSpacerButton } from "./add.spacer.button.screen";
import { AddCategoryButton } from "./add.category.button.screen";

interface Props {}

interface State {
  emptySpaceWidth: number;
  addSpacerButtonWidth: number;
  innerEmptySpaceWidth: number;
  addCategoryButtonWidth: number;
  height : number;
}

export class AddSpacerOrCategoryScreen extends Component {

  state : State;

  constructor(props: Props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);

    this.state = {
      emptySpaceWidth: 10,
      addSpacerButtonWidth: 10,
      innerEmptySpaceWidth: 1,
      addCategoryButtonWidth: 10,
      height : 1
    };
  }

  onLayout(event: LayoutChangeEvent) {
    const parentWidth = event.nativeEvent.layout.width;
    const parentHeight = event.nativeEvent.layout.height;

    const EMPTY_SPACE_PERCENTAGE = .10;
    const emptySpaceWidth = parentWidth * EMPTY_SPACE_PERCENTAGE;
    const addSpacerButtonWidth = parentHeight;

    const INNER_SPACE_PERCENTAGE = .02;
    const innerEmptySpaceWidth = parentWidth * INNER_SPACE_PERCENTAGE;

    const currentlyUsedWidth = (emptySpaceWidth * 2) + addSpacerButtonWidth + innerEmptySpaceWidth;
    const addCategoryButtonWidth = parentWidth - currentlyUsedWidth;

    this.setState({
      emptySpaceWidth,
      addSpacerButtonWidth,
      innerEmptySpaceWidth,
      addCategoryButtonWidth,
      height : parentHeight
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems : 'center'
        }}
        onLayout={this.onLayout}
      >
        <View
          style={{
            width: this.state.emptySpaceWidth,
            height : this.state.height
          }}
        ></View>
        <View
          style={{
            width: this.state.addSpacerButtonWidth,
            height : this.state.height
          }}
        >
          <AddSpacerButton
            onPress={this.props.onSpacerAddPress}
          ></AddSpacerButton>
        </View>
        <View
          style={{
            width : this.state.innerEmptySpaceWidth,
            height : this.state.height
          }}
        ></View>
        <View
          style={{
            width : this.state.addCategoryButtonWidth,
            height : this.state.height
          }}
        >
          <AddCategoryButton
            onPress={this.props.onCategoryAddPress}
          ></AddCategoryButton>
        </View>
        <View
          style={{
            width: this.state.emptySpaceWidth,
            height : this.state.height
          }}
        ></View>
      </View>
    );
  }
}
