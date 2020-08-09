import React, { Component } from "react";
import { View, Image } from "react-native";
import { PerfectCircle } from "./perfect.circle";
import { Text } from "react-native-elements";
import { TransactionScreenSegment } from "./transaction.screen.segment";
import { Color } from "../pojo/color";
import { Transaction } from "../pojo/transaction";
import { BoldFontFamily } from "../css/styles";
import { isMobile, isBrowser } from "react-device-detect";

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
              diameter={32}
            >
              <Image
                source={require("../../assets/minus-dash.png")}
                resizeMode="contain"
                style={{
                  width: isMobile ? 10 : 20,
                  height: isMobile ? 15 : 35,
                }}
              ></Image>
            </PerfectCircle>
          </View>
          <View
            style={{
              flex: 1,
            }}
          ></View>
          <View
            style={{
              flex: 8,
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            ></View>
            <View
              style={{
                flex: 8,
                width: "60%",
                alignSelf: "center",
              }}
            >
              <TransactionScreenSegment
                canDelete={false}
                transaction={this.props.currentTransaction}
                textColor={new Color("#787878")}
                containerStyle={{
                  backgroundColor: "#F7F7F7",
                  borderColor: "#989898",
                  borderWidth: 4.4,
                  borderRadius: 16,
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

        {!isMobile && (
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignSelf: "flex-end",
              marginRight: 30,
            }}
          >
            <PerfectCircle color={new Color("#f76f6f")} diameter={83}>
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
        )}
        <View style={{
          height : 10
        }}></View>
      </View>
    );
  }
}
