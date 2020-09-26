import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { CATEGORY_FONT_SIZE } from "./category.screen";
import { BoldFontFamily, FontFamily, RegularFontFamily } from "../css/styles";
import { TransactionDetail } from "../pojo/transaction.detail";

interface State {
  fontSize : number;
}

export class DetailsScreenSegment extends Component {

  state : State;

  constructor(props) {
    super(props);

    this.state = {
      fontSize : Math.floor(CATEGORY_FONT_SIZE * .90 )
    }
  }

  getViewForHorizontalOrientation() {
    const details = this.props.details;
    let horizontalText = "";
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      const element = detail.getElement() ? detail.getElement() : "-";

      if (i != details.length - 1) {
        horizontalText = horizontalText + element + " | ";
      } else {
        horizontalText = horizontalText + element;
      }
    }

    return (
      <Text
        numberOfLines={1}
        style={{
          color: this.props.textColor.hex(),
          fontFamily: FontFamily,
          fontSize: this.state.fontSize,
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
          key={detail.getElement()}
          style={{
            flex: 1,
            alignSelf: "flex-start",
          }}
        >
          <View
            style={{
              height: 3,
            }}
          ></View>
          <Text
            numberOfLines={1}
            style={{
              color: this.props.textColor.hex(),
              fontFamily: FontFamily,
              fontSize: this.state.fontSize,
              marginLeft : 5,
            }}
          >
            { detail.getElement()}
          </Text>
          <View
            style={{
              height: 3,
            }}
          ></View>
        </View>
      );
    };

    const details = this.props.details;
    const views = [];

    views.push(<View style={{
      height : 6 
    }}></View>);
    for (let i = 0; i < details.length; i < i++) {
      views.push(generateDetailLine(details[i]));
    }
    views.push(<View style={{
      height : 6 
    }}></View>);
    return views;
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          alignContent: "space-around",
        }}
      >
        {this.props.orientation == "row" &&
          this.getViewForHorizontalOrientation()}
        {this.props.orientation == "column" &&
          this.getViewForVerticalOrientation()}
      </View>
    );
  }
}
