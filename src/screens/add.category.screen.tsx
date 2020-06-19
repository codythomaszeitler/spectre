import React, { Component } from "react";
import { Card, Button, Input } from "react-native-elements";
import { SpectreUser } from "../pojo/spectre.user";
import { datastore } from "../datastore/datastore";
import {Category} from '../pojo/category';

export class AddCategoryScreen extends Component {
  spectreUser: SpectreUser;

  constructor(props) {
    super(props);
    this.onAddCategoryPress = this.onAddCategoryPress.bind(this);

    this.spectreUser = datastore().get();

    this.state = {
        categoryAddText : ''
    }
  }

  onAddCategoryPress(event) {
    // This function changes based on what state the screen is currently in
    if (this.state.categoryAddText) {
      const category = new Category(this.state.categoryAddText);
      this.spectreUser.addCategory(category);

      this.props.onSuccessfulAdd(category);
    }
  }

  render() {
    return (
      <Card title="Add Category">
        <Input
          placeholder="Category"
          onChangeText={(text) => {
            this.setState({
              categoryAddText: text,
            });
          }}
          value={this.state.categoryAddText}
        />
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
      </Card>
    );
  }
}
