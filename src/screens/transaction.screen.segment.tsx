import React, { Component } from "react";
import { Card, Text } from "react-native-elements";

export class TransactionScreenSegment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card containerStyle={this.props.containerStyle}>
        <Text style={{
          color : this.props.textColor
        }}>{this.props.transaction.getAmount().toString()}</Text>

        {this.props.transaction.getDetails().map((item) => {
          return <Text key={item.detail} style={{
            color : this.props.textColor
          }}>{item.detail}</Text>;
        })}
      </Card>
    );
  }
}
