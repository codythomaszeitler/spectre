import React, { Component } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { TextInput } from "react-native";
import { Text } from "react-native-elements";
import { SpectreUser } from "../pojo/spectre.user";
import { Color } from "../pojo/color";
import { datastore } from "../datastore/datastore";
import { Category } from "../pojo/category";
import { CategoryColors, FontFamily } from "../css/styles";
import { Alert } from "./alert";
import {
  CATEGORY_BOX_HEIGHT,
  CATEGORY_BOX_INSET,
  CATEGORY_FONT_SIZE,
} from "./category.screen";
import { DeleteButton } from "./delete.button";
import { ColorChoicesBar } from "./color.choices.bar";
import { TRANSACTION_DIAMETER, WHITESPACE_LEFT_OF_CATEGORY_TEXT } from "./category.screen";
import {isMobile} from 'react-device-detect';

export class AddCategoryScreen extends Component {
  spectreUser: SpectreUser;

  constructor(props) {
    super(props);
    this.onAddCategoryPress = this.onAddCategoryPress.bind(this);
    this.onLayout = this.onLayout.bind(this);

    this.spectreUser = datastore().get();

    this.textBoxReference = React.createRef();

    this.state = {
      categoryAddText: "",
      color: new Color(CategoryColors[0]),
      colorChoiceDiameter: 35,
      colorChoiceBarWidth: 500,
      numTransactionsDiameter: TRANSACTION_DIAMETER,
    };
  }

  onAddCategoryPress() {
    try {
      // This function changes based on what state the screen is currently in
      if (this.state.categoryAddText) {
        const category = new Category(this.state.categoryAddText);
        this.spectreUser.addCategory(category);

        this.props.onSuccessfulAdd(category, this.state.color);

        this.setState({
          categoryAddText: "",
          color: CategoryColors[0],
        });
      }
    } catch (e) {
      const errorDialog = new Alert();
      errorDialog.show(e.message);
    }
  }

  onLayout(event: LayoutChangeEvent) {
    const componentWidth = event.nativeEvent.layout.width;
    this.setState({
      colorChoiceBarWidth: this.getColorChoiceBarWidth(componentWidth),
    });
  }

  getColorChoiceBarWidth(currentWidth: number) {
    const NORMAL_WIDTH = 400;
    let width = NORMAL_WIDTH;
    if (currentWidth < NORMAL_WIDTH) {
      width = currentWidth;
    }
    return width;
  }

  render() {
    return (
      <View onLayout={this.onLayout}>
        <View
          style={{
            flexBasis: CATEGORY_BOX_HEIGHT,
            borderRadius: CATEGORY_BOX_INSET,
            backgroundColor: this.state.color.hex(),
            justifyContent: "center",
            flexGrow: 1,
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View
              style={{
                width : WHITESPACE_LEFT_OF_CATEGORY_TEXT
              }}
            ></View>
            <View
              style={{
                flex: 10,
              }}
            >
              <TextInput
                ref={(reference) => {
                  this.textBoxReference = reference;
                }}
                placeholder=""
                placeholderTextColor="white"
                selectionColor="white"
                autoFocus={true}
                onSubmitEditing={this.onAddCategoryPress}
                style={{
                  backgroundColor: this.state.color.hex(),
                  fontFamily: FontFamily,
                  fontSize: isMobile ? CATEGORY_FONT_SIZE : CATEGORY_FONT_SIZE + 3,
                  color: "white",
                }}
                onChangeText={(categoryText) => {
                  this.setState({
                    categoryAddText: categoryText,
                  });
                }}
                value={this.state.categoryAddText}
              />
            </View>

            <View
              style={{
                flex: 0.5,
              }}
            ></View>
            <View
              style={{
                justifyContent: "flex-end",
                width: CATEGORY_BOX_HEIGHT,
                height: CATEGORY_BOX_HEIGHT,
              }}
            >
              <DeleteButton
                onPress={this.props.onStopAddCategory}
                image={require("../../assets/x-delete.png")}
                color={new Color("#fa756b")}
                borderRadius={CATEGORY_BOX_INSET}
              ></DeleteButton>
            </View>
          </View>
        </View>

        <View
          style={{
            height: 15,
          }}
        ></View>

        <ColorChoicesBar
          diameter={35}
          onColorSelect={(colorChoice: Color) => {
            this.setState({
              color: colorChoice,
            });
            this.textBoxReference.focus();
          }}
          width={this.state.colorChoiceBarWidth}
        ></ColorChoicesBar>
      </View>
    );
  }
}
