import React, { Component } from "react";
import { View } from "react-native";
import { Card, Text } from "react-native-elements";
import { Transaction } from "../pojo/transaction";
import { DeleteButton } from "./delete.button";
import { DetailsSceenSegement } from "./details.screen.segment";
import GestureRecognizer from "react-native-swipe-gestures";

export class TransactionScreenSegment extends Component {
  constructor(props) {
    super(props);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.showDeleteButton = this.showDeleteButton.bind(this);
    this.hideDeleteButton = this.hideDeleteButton.bind(this);
    this.onLongPressShowHideDeleteButton = this.onLongPressShowHideDeleteButton.bind(this);

    this.state = {
      showDeleteButton : false
    }
  }

  onDeletePress() {
    this.props.onDelete(new TransactionDeletePress(this.props.transaction));
  }

  getTransactionDetailOrientation() {
    let orientation = "column";
    if (this.props.isHorizontal) {
      orientation = "row";
    }
    return orientation;
  }

  showDeleteButton() {
    this.setState({
      showDeleteButton: true
    });
  }

  hideDeleteButton() {
    this.setState({
      showDeleteButton : false
    });
  }

  onLongPressShowHideDeleteButton() {
    this.setState({
      showDeleteButton : !this.state.showDeleteButton
    });
  }

  render() {
    return (
      <View>
        <GestureRecognizer
          onSwipeLeft={this.showDeleteButton}
          onSwipeRight={this.hideDeleteButton}
        >
          <Card containerStyle={this.props.containerStyle}>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  flexDirection: this.getTransactionDetailOrientation(),
                  flex: 10,
                }}
              >
                <DetailsSceenSegement
                  details={this.props.transaction.getDetails()}
                  textColor={this.props.textColor}
                  orientation={this.getTransactionDetailOrientation()}
                  maxDetailStringLength={40}
                ></DetailsSceenSegement>
              </View>

              {this.props.canDelete && this.state.showDeleteButton && (
                <View
                  style={{
                    alignSelf: "center",
                    flex: 1,
                  }}
                >
                  <DeleteButton
                    color={this.props.backgroundColor.darkerBy(1.2)}
                    onPress={this.onDeletePress}
                    diameter={20}
                  ></DeleteButton>
                </View>
              )}
            </View>
          </Card>
        </GestureRecognizer>
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
