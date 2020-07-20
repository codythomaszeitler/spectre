import React, { Component } from "react";
import { View } from "react-native";
import { Card, Text } from "react-native-elements";
import { Transaction } from "../pojo/transaction";
import { FontFamily } from "../css/styles";
import { CATEGORY_FONT_SIZE } from "./category.screen";
import { DeleteButton } from "./delete.button";
import {TransactionDetail} from '../pojo/info.line';

export class TransactionScreenSegment extends Component {
  constructor(props) {
    super(props);
    this.onDeletePress = this.onDeletePress.bind(this);
  }

  onDeletePress() {
    this.props.onDelete(new TransactionDeletePress(this.props.transaction));
  }

  getTransactionDetailOrientation() {
    let orientation = 'column';
    console.log(this.props.isHorizontal)
    if(this.props.isHorizontal) {
      orientation = 'row'; 
    }    
    return orientation;
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Card containerStyle={this.props.containerStyle}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}
          >
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection : this.getTransactionDetailOrientation(),
                flex: 10,
              }}
            >
              {this.props.transaction.getDetails().map((item, index) => {
                const isLastFilledIn = () => {
                  const details = this.props.transaction.getDetails();
                  if ((details.length - 1) === index) {
                    return true;
                  }

                  let isLastFilledIn = true;
                  const toCheck = details.slice(index + 1, details.length);
                  for (let i = 0; i < toCheck.length; i++) {
                    const element = toCheck[i].getElement();
                    if (element.trim().length !== 0) {
                      isLastFilledIn = false;
                      break;
                    }
                  }

                  return isLastFilledIn;
                }

                const getPostfix = () => {
                  let postFix = '';
                  if (this.getTransactionDetailOrientation() === 'row') {
                    postFix = ' | '
                  }

                  if (index === this.props.transaction.getDetails().length - 1) {
                    postFix = '';
                  }

                  if (item.getElement().trim().length === 0) {
                    postFix = '';
                  }

                  if (isLastFilledIn()) {
                    postFix = '';
                  }

                  return postFix;
                }
                const postFix = getPostfix();

                return (
                  <Text
                    key={item.detail}
                    style={{
                      color: this.props.textColor,
                      fontFamily: FontFamily,
                      fontSize: Math.floor(CATEGORY_FONT_SIZE * 0.8),
                    }}
                  >
                    {item.detail + postFix}
                  </Text>
                );
              })}
            </View>
            <View
              style={{
                alignSelf: "center",
                flex: 1,
              }}
            >
              {this.props.canDelete && (
                <DeleteButton
                  color={this.props.backgroundColor.darkerBy(1.2)}
                  onPress={this.onDeletePress}
                  diameter={20}
                ></DeleteButton>
              )}
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

export class TransactionDeletePress {
  transaction: Transaction;

  constructor(transaction: Transaction) {
    this.transaction = transaction.copy();
  }
}
