import React, { Component } from "react";
import { View } from "react-native";
import { TextInput } from "react-native";
import { Card, Button, Input, Text } from "react-native-elements";
import { SpectreUser } from "../pojo/spectre.user";
import { Color } from "../pojo/color";
import { datastore } from "../datastore/datastore";
import { Category } from "../pojo/category";
import { ColorChoiceScreenSegment } from "./color.choice.screen.segment";
import { CategoryColors, FontFamily } from "../css/styles";
import { Alert } from "./alert";
import { CATEGORY_BOX_HEIGHT, CATEGORY_BOX_INSET, CATEGORY_FONT_SIZE } from "./category.screen";
import { TransactionCounter } from "./transaction.counter";
import { DeleteButton } from "./delete.button";

export class AddCategoryScreen extends Component {
  spectreUser: SpectreUser;

  colors: Array<Color>;

  constructor(props) {
    super(props);
    this.onAddCategoryPress = this.onAddCategoryPress.bind(this);

    this.spectreUser = datastore().get();

    this.colors = [];

    for (let i = 0; i < CategoryColors.length; i++) {
      this.colors.push(new Color(CategoryColors[i]));
    }

    this.state = {
      categoryAddText: "",
      color: this.colors[0],
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
          color: this.colors[0],
        });
      }
    } catch (e) {
      const errorDialog = new Alert();
      errorDialog.show(e.message);
    }
  }

  render() {
    return (
      <View>
        <View
          style={{
            backgroundColor: this.state.color.hex(),
            flexBasis : CATEGORY_BOX_HEIGHT,
            justifyContent: "center",
            borderRadius: CATEGORY_BOX_INSET,
            flexGrow : 1
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent : 'center',
            }}
          >
            <View
              style={{
                flex: .1,
              }}
            ></View>
            <View
              style={{ 
                flex: 10,
              }}
            >
              <TextInput
                placeholder="Press enter to finish adding category..."
                placeholderTextColor="white"
                selectionColor="white"
                autoFocus={true}
                onSubmitEditing={this.onAddCategoryPress}
                style={{
                  backgroundColor: this.state.color.hex(),
                  fontFamily: FontFamily,
                  fontSize: CATEGORY_FONT_SIZE,
                  color: 'white'
                }}
                onChangeText={(categoryText) => {
                  this.setState({
                    categoryAddText : categoryText
                  });
                }}
                value={this.state.categoryAddText}
              />
            </View>
            <View style={{
              flex : 1,
              justifyContent : 'flex-end'
            }}>
              <TransactionCounter color={this.state.color} numTransactions={0}>

              </TransactionCounter>
            </View>
            <View style={{
              flex : 1,
              justifyContent : 'flex-end'
            }}>
              <DeleteButton color={this.state.color} onPress={this.props.onStopAddCategory}>
              </DeleteButton>
            </View>
            <View
              style={{
                flex: .25,
              }}
            ></View>
          </View>
        </View>

        <View
          style={{
            height: 10,
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {this.colors.map((color) => {
            let lightnessFactor = 1.35;
            if (color.equals(this.state.color)) {
              lightnessFactor = 1;
            }

            return (
              <ColorChoiceScreenSegment
                onPress={(colorChoice: Color) => {
                  this.setState({
                    color: colorChoice,
                  });
                }}
                lightnessFactor={lightnessFactor}
                color={color}
                currentSelectedColor={this.state.color}
              ></ColorChoiceScreenSegment>
            );
          })}
        </View>
      </View>
    );
  }
}
