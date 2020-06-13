import React, {Component} from 'react';
import {Card, Text} from 'react-native-elements';

export class TransactionScreenSegment extends Component {

    constructor(props) {
        super(props);
    }

  render() {
    return (
      <Card
        containerStyle={this.props.containerStyle}
      >
        <Text>{this.props.transaction.getAmount().toString()}</Text>

        {this.props.transaction.getDetails().map(function (item) {
          return <Text key={item.detail}>{item.detail}</Text>;
        })}
      </Card>
    );
  }
}
