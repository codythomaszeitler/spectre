import React, {Component} from 'react';
import {Card, Text} from 'react-native-elements';

export class TransactionScreenSegment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            transaction : props.transaction
        }
    }

  render() {
    return (
      <Card
        containerStyle={this.props.containerStyle}
      >
        <Text>{this.state.transaction.getAmount().toString()}</Text>

        {this.state.transaction.getDetails().map(function (item) {
          return <Text key={item.detail}>{item.detail}</Text>;
        })}
      </Card>
    );
  }
}
