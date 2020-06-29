import React, { Component } from "react";
import { View } from "react-native";
import { Card, Button, Input, Text } from "react-native-elements";
import { SpectreUser } from "../pojo/spectre.user";
import { datastore } from "../datastore/datastore";
import { Category } from "../pojo/category";
import { ColorChoiceScreenSegment } from "./color.choice.screen.segment";
import { CategoryColors } from "../css/styles";
import { Alert } from "./alert";

export class AddCategoryScreen extends Component {
  spectreUser: SpectreUser;

  colors = CategoryColors;

  constructor(props) {
    super(props);
    this.onAddCategoryPress = this.onAddCategoryPress.bind(this);

    this.spectreUser = datastore().get();

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
      <Card title="Add Category">
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
            }}
          >
            <Input
              placeholder="Category"
              onChangeText={(text) => {
                this.setState({
                  categoryAddText: text,
                });
              }}
              value={this.state.categoryAddText}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              flex: 5,
            }}
          >
            {this.colors.map(
              function (value) {
                return (
                  <View
                    style={{
                      flex: 1,
                    }}
                    key={value}
                  >
                    <ColorChoiceScreenSegment
                      onPress={(color) => {
                        this.setState({
                          color: color,
                        });
                      }}
                      color={value}
                      currentSelectedColor={this.state.color}
                    ></ColorChoiceScreenSegment>
                  </View>
                );
              }.bind(this)
            )}
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Button
              buttonStyle={{
                backgroundColor: "#ced4de",
                marginTop: 10,
                paddingTop: 15,
                paddingBottom: 15,
                marginLeft: 30,
                marginRight: 30,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#fff",
              }}
              icon={{
                name: "add",
                size: 15,
                color: "white",
              }}
              onPress={this.onAddCategoryPress}
            ></Button>
          </View>
        </View>
      </Card>
    );
  }
}
