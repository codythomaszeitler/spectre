import React, { Component } from "react";
import { View } from "react-native";
import { PerfectCircle } from "./perfect.circle";
import { Text } from "react-native-elements";
import { TransactionScreenSegment } from "./transaction.screen.segment";
import { Color } from "../pojo/color";
import { Transaction } from "../pojo/transaction";
import { BoldFontFamily } from "../css/styles";

interface Props {
  onCategorizationEnd: () => void;
  currentTransaction: Transaction;
}

export class CategorizationModeBottomBar extends Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              flex: 1,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <PerfectCircle
              borderColor={new Color("#f76f6f")}
              color={new Color("#f76f6f")}
              onPress={this.props.onCategorizationEnd}
              diameter={30}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 50,
                  fontFamily : BoldFontFamily
                }}
              >
                -
              </Text>
              <Text
                style={{
                  fontSize: 10,
                }}
              >
                {"  "}
              </Text>
            </PerfectCircle>
          </View>
          <View style={{
            flex : 5
          }}></View>
          <View
            style={{
              flex: 8,
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flex: 0.5,
              }}
            ></View>
            <View
              style={{
                flex: 8,
                width : '60%',
                alignSelf : 'center'
              }}
            >
              <TransactionScreenSegment
                canDelete={false}
                transaction={this.props.currentTransaction}
                textColor={new Color("#7a7a7a").darkerBy(1.5)}
                containerStyle={{
                    backgroundColor : '#d6d6d6',
                    borderColor : '#969696',
                    borderWidth : 3,
                    borderRadius : 10
                }}
              ></TransactionScreenSegment>
            </View>
          </View>
        </View>

        <View
          style={{
            flex: 2.5,
            alignSelf: "flex-end",
          }}
        ></View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignSelf: "flex-end",
            marginRight : 30
          }}
        >
          <PerfectCircle color={new Color("#f76f6f")} diameter={100}>
            <Text
              numberOfLines={1}
              style={{
                color: "white",
                fontFamily: BoldFontFamily,
                fontSize: 32,
              }}
            >
              {this.props.numUncategorized}
            </Text>
          </PerfectCircle>
        </View>
      </View>
    );
  }
}
