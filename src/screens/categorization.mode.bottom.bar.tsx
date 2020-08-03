import React, { Component } from "react";
import { View } from "react-native";
import { PerfectCircle } from "./perfect.circle";
import { Text } from "react-native-elements";
import { TransactionScreenSegment } from "./transaction.screen.segment";
import { Color } from "../pojo/color";
import { Transaction } from "../pojo/transaction";
import {FontFamily} from '../css/styles';

interface Props {
    onCategorizationEnd : () => void;
    currentTransaction : Transaction;
}

export class CategorizationModeBottomBar extends Component {

    constructor(props : Props) {
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
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              flex: 2,
            }}
          ></View>
          <View
            style={{
              flex: 1,
              alignSelf: "flex-start",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <PerfectCircle
              borderColor={new Color("#FF7676")}
              color={new Color("#FFFFFF")}
              onPress={this.props.onCategorizationEnd}
              diameter={30}
            >
              <Text
                style={{
                  color: "red",
                  fontSize: 30,
                }}
              >
                -
              </Text>
              <Text
                style={{
                  fontSize: 5,
                }}
              >
                {"  "}
              </Text>
            </PerfectCircle>
          </View>
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
                flex: 4,
              }}
            >
              <TransactionScreenSegment
                canDelete={false}
                transaction={this.props.currentTransaction}
                textColor={new Color("#7a7a7a").darkerBy(1.5)}
                containerStyle={{
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 5,
                  borderRadius: 5,
                  opacity: 0.7,
                }}
              ></TransactionScreenSegment>
            </View>
          </View>
          <View
            style={{
              flex: 2.5,
              alignSelf: "flex-end",
            }}
          ></View>
        </View>
        <View
          style={{
            alignSelf: "center",
            alignItems: "stretch",
            justifyContent: "flex-end",
            flex: 0.5,
            width: 25,
            height: 25,
            zIndex: -1,
          }}
        >
          <PerfectCircle color={new Color("#f76f6f")} diameter={75}>
            <Text
              numberOfLines={1}
              style={{
                color: "white",
                fontFamily: FontFamily,
                fontSize: 20,
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
