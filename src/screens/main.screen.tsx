import React, { Component } from "react";
import { View } from "react-native";
import { CategorizationScreen } from "./categorization.screen";
import { HelpScreen } from "./help.screen";
import { datastore } from "../datastore/datastore";
import { SpectreUser } from "../pojo/spectre.user";
import { Color } from "../pojo/color";

export interface State {
  showHelpScreen: boolean;
  showCategorizationScreen: boolean;
}

export interface Props {}

export class MainScreen extends Component<Props, State> {
  categorizationScreen: CategorizationScreen;
  helpScreen: HelpScreen;

  categoryColors: Map<string, Color>;
  categoryOrder: Map<string, number>;

  constructor(props: Props) {
    super(props);
    const model = new SpectreUser();
    datastore().set(model);

    this.state = {
      showHelpScreen: false,
      showCategorizationScreen: true,
    };
    this.changeToHelpScreen = this.changeToHelpScreen.bind(this);
    this.changeToCategoryScreen = this.changeToCategoryScreen.bind(this);

    this.categoryColors = new Map<string, Color>();
    this.categoryOrder = new Map<string, number>();

    this.categorizationScreen = (
      <CategorizationScreen
        onHelpScreenPress={this.changeToHelpScreen}
        categoryColors={this.categoryColors}
        categoryOrder={this.categoryOrder}
      ></CategorizationScreen>
    );
    this.helpScreen = (
      <HelpScreen onBackButtonPress={this.changeToCategoryScreen}></HelpScreen>
    );
  }

  changeToHelpScreen() {
    this.setState({
      showHelpScreen: true,
      showCategorizationScreen: false,
    });
  }

  changeToCategoryScreen() {
    this.setState({
      showHelpScreen: false,
      showCategorizationScreen: true,
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.showCategorizationScreen && this.categorizationScreen}
        {this.state.showHelpScreen && this.helpScreen}
      </View>
    );
  }
}
