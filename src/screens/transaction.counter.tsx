import React, { Component } from "react";
import {Text} from 'react-native-elements';
import { PerfectCircle } from "./perfect.circle";
import { FontFamily } from "../css/styles";

export class TransactionCounter extends Component {
  render() {
    return (
      <PerfectCircle color={this.props.color.darkerBy(1.2)} diameter={30}>
        <Text
          style={{
            fontFamily: FontFamily,
            color: "white",
          }}
        >
          {this.props.numTransactions}
        </Text>
      </PerfectCircle>
    );
  }
}
