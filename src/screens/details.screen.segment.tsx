import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { CATEGORY_FONT_SIZE } from "./category.screen";
import { FontFamily } from "../css/styles";
import { TransactionDetail } from "../pojo/info.line";

export class DetailsSceenSegement extends Component {
  constructor(props) {
    super(props);
  }

  getViewForHorizontalOrientation() {
    const details = this.props.details;
    let horizontalText = "";
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      horizontalText = detail.getElement() + " | " + horizontalText;
    }

    return (
      <Text
        numberOfLines={1}
        style={{
          color: this.props.textColor,
          fontFamily: FontFamily,
          fontSize: Math.floor(CATEGORY_FONT_SIZE * 0.8),
        }}
      >
        {horizontalText}
      </Text>
    );
  }

  getViewForVerticalOrientation() {
    const generateDetailLine = (detail: TransactionDetail) => {
      return (
        <View
          style={{
            flex: 1,
            alignSelf : 'flex-end',
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: this.props.textColor,
              fontFamily: FontFamily,
              fontSize: Math.floor(CATEGORY_FONT_SIZE * 0.8),
            }}
          >
            {detail.getElement().substring(0, 45)}
          </Text>
        </View>
      );
    };

    const details = this.props.details;
    const views = [];

    for (let i = 0; i < details.length; i < i++) {
      views.push(generateDetailLine(details[i]));
    }
    return views;
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        {this.props.orientation == 'row' && this.getViewForHorizontalOrientation()}
        {this.props.orientation == 'column' && this.getViewForVerticalOrientation()}
      </View>
    );
  }
}
