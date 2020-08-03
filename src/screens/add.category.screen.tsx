import React, { Component } from "react";
import { View } from "react-native";
import { TextInput } from "react-native";
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
import { TransactionCounter } from "./transaction.counter";
import { DeleteButton } from "./delete.button";
import { ColorChoicesBar } from "./color.choices.bar";

export class AddCategoryScreen extends Component {
  spectreUser: SpectreUser;

  constructor(props) {
    super(props);
    this.onAddCategoryPress = this.onAddCategoryPress.bind(this);

    this.spectreUser = datastore().get();

    this.textBoxReference = React.createRef();

    this.state = {
      categoryAddText: "",
      color: new Color(CategoryColors[0]),
      colorChoiceDiameter: 35,
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

  render() {
    return (
      <View>
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
                flex: 0.33,
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
                placeholder="Enter category..."
                placeholderTextColor="white"
                selectionColor="white"
                autoFocus={true}
                onSubmitEditing={this.onAddCategoryPress}
                style={{
                  backgroundColor: this.state.color.hex(),
                  fontFamily: FontFamily,
                  fontSize: CATEGORY_FONT_SIZE + 3,
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
                flex: 1.75,
              }}
            ></View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              <TransactionCounter
                color={this.state.color}
                numTransactions={0}
              ></TransactionCounter>
            </View>
            <View
              style={{
                flex: 0.5,
              }}
            ></View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              <DeleteButton
                color={this.state.color}
                onPress={this.props.onStopAddCategory}
              ></DeleteButton>
            </View>
            <View
              style={{
                flex: 0.2,
              }}
            ></View>
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
          width={600}
        ></ColorChoicesBar>
      </View>
    );
  }
}
