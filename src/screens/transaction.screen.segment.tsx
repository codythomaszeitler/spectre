import React, { Component } from "react";
import { View } from "react-native";
import { Card, Text } from "react-native-elements";
import { Transaction } from "../pojo/transaction";
import { DeleteButton } from "./delete.button";
import {TransactionDetail} from '../pojo/info.line';
import { DetailsSceenSegement } from "./details.screen.segment";
import { Color } from "../pojo/color";

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
              <DetailsSceenSegement details={this.props.transaction.getDetails()} textColor={new Color('#FFFFFF')} orientation={this.getTransactionDetailOrientation()}></DetailsSceenSegement>
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
