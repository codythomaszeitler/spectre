import React, { Component } from "react";
import { View, TouchableOpacity, LayoutChangeEvent } from "react-native";
import { Card, Text } from "react-native-elements";
import { Transaction } from "../pojo/transaction";
import { DeleteButton } from "./delete.button";
import { DetailsScreenSegment } from "./details.screen.segment";
import GestureRecognizer from "react-native-swipe-gestures";
import { CATEGORY_BOX_INSET } from "./category.screen";

interface State {
  showDeleteButton: boolean;
  deleteButtonWidth: number;
}

export class TransactionScreenSegment extends Component {
  state: State;

  constructor(props) {
    super(props);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.showDeleteButton = this.showDeleteButton.bind(this);
    this.hideDeleteButton = this.hideDeleteButton.bind(this);
    this.onLongPressShowHideDeleteButton = this.onLongPressShowHideDeleteButton.bind(
      this
    );
    this.onLayout = this.onLayout.bind(this);

    this.state = {
      showDeleteButton: false,
      deleteButtonWidth: 10,
    };
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
      showDeleteButton: true,
    });
  }

  hideDeleteButton() {
    this.setState({
      showDeleteButton: false,
    });
  }

  onLongPressShowHideDeleteButton() {
    this.setState({
      showDeleteButton: !this.state.showDeleteButton,
    });
  }

  onLayout(event: LayoutChangeEvent) {
    const componentHeight = event.nativeEvent.layout.height;

    this.setState({
      deleteButtonWidth: componentHeight,
    });
  }

  render() {
    return (
      <GestureRecognizer
        onSwipeLeft={this.showDeleteButton}
        onSwipeRight={this.hideDeleteButton}
      >
        <View
          onMouseEnter={() => {
            this.setState({
              showDeleteButton: true,
            });
          }}
          onMouseLeave={() => {
            this.setState({
              showDeleteButton: false,
            });
          }}
          style={{
            ...this.props.containerStyle,
            flexDirection: "row",
            justifyContent: "center",
          }}
          onLayout={this.onLayout}
        >
          <View
            style={{
              flex: 0.15,
            }}
          ></View>
          <View
            style={{
              flexDirection: this.getTransactionDetailOrientation(),
              flex: 10,
              alignSelf: "center",
            }}
          >
            <DetailsScreenSegment
              details={this.props.transaction.getDetails()}
              textColor={this.props.textColor}
              orientation={this.getTransactionDetailOrientation()}
              maxDetailStringLength={40}
            ></DetailsScreenSegment>
          </View>

          {this.props.canDelete && this.state.showDeleteButton && (
            <View
              style={{
                justifyContent: "flex-end",
                width: this.state.deleteButtonWidth,
                height: this.state.deleteButtonWidth,
                borderRadius: CATEGORY_BOX_INSET,
              }}
            >
              <DeleteButton
                color={this.props.backgroundColor.darkerBy(1.2)}
                onPress={this.onDeletePress}
                borderRadius={CATEGORY_BOX_INSET}
              ></DeleteButton>
            </View>
          )}
        </View>
      </GestureRecognizer>
    );
  }
}

export class TransactionDeletePress {
  transaction: Transaction;

  constructor(transaction: Transaction) {
    this.transaction = transaction.copy();
  }
}
