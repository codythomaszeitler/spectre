import React, { Component } from "react";
import { View } from "react-native";
import { CategorizationScreen } from "./categorization.screen";
import { HelpScreen } from "./help.screen";

export interface State {
  showHelpScreen: boolean;
  showCategorizationScreen: boolean;
}

export class MainScreen extends Component {
  categorizationScreen: CategorizationScreen;
  helpScreen: HelpScreen;

  constructor(props) {
    super(props);
    this.state = {
      showHelpScreen: false,
      showCategorizationScreen: true,
    };
    this.changeToHelpScreen = this.changeToHelpScreen.bind(this);
    this.changeToCategoryScreen = this.changeToCategoryScreen.bind(this);

    this.categorizationScreen = <CategorizationScreen onHelpScreenPress={this.changeToHelpScreen}></CategorizationScreen>;
    this.helpScreen = <HelpScreen onBackButtonPress={this.changeToCategoryScreen}></HelpScreen>;
  }

  changeToHelpScreen() {
      this.setState({
          showHelpScreen : true,
          showCategorizationScreen : false
      });
  }

  changeToCategoryScreen() {
    this.setState({
          showHelpScreen : false,
          showCategorizationScreen : true 
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
