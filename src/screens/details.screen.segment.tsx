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
      const element = detail.getElement() ? detail.getElement() : '-';

      if (i != details.length - 1) {
        horizontalText = horizontalText + element + ' | ';
      } else {
        horizontalText = horizontalText + element;
      }
    }

    horizontalText = horizontalText.replace(new RegExp(' | ' + '$'), '');

    return (
      <Text
        numberOfLines={1}
        style={{
          color: this.props.textColor.hex(),
          fontFamily: FontFamily,
          fontSize: Math.floor(CATEGORY_FONT_SIZE * 0.8),
        }}
      >
        {horizontalText}
      </Text>
    );
  }

  getViewForVerticalOrientation() {

    const getTruncatedString = (detail : TransactionDetail) => {
      let truncatedString = detail.getElement();
      if (truncatedString.length > this.props.maxDetailStringLength) {
        truncatedString = truncatedString.substring(0, this.props.maxDetailStringLength);
        truncatedString = truncatedString + '...';
      }
      return truncatedString;
    }

    const generateDetailLine = (detail: TransactionDetail) => {
      return (
        <View
          key={detail.getElement()}
          style={{
            flex: 1,
            alignSelf : 'flex-end',
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: this.props.textColor.hex(),
              fontFamily: FontFamily,
              fontSize: Math.floor(CATEGORY_FONT_SIZE * 0.75),
            }}
          >
            {getTruncatedString(detail)}
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
