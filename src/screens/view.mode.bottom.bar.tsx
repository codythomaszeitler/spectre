import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { DocumentPicker } from "./document.picker.screen";
import { ExportButtonScreen } from "./export.button.screen";
import { PerfectCircle } from "./perfect.circle";
import { Color } from "./../pojo/color";
import { FontFamily } from "../css/styles";

export class ViewModeBottomBar extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            flex: 5,
            alignSelf: "stretch",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              flex: 3,
              width: "75%",
              height: "75%",
            }}
          >
            <DocumentPicker
              onSuccessfulLoadListener={this.props.onSuccessfulLoadListener}
            ></DocumentPicker>
          </View>
          <View
            style={{
              flex: 1,
            }}
          ></View>
          <View
            style={{
              alignSelf: "center",
              flex: 3,
              width: "75%",
              height: "75%",
            }}
          >
            <ExportButtonScreen
              onPress={this.props.onExportButtonPress}
            ></ExportButtonScreen>
          </View>
        </View>
        <View
          style={{
            flex: 5,
          }}
        ></View>
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "center",
            flex: 3,
            width: "100%",
            height: "100%",
          }}
        >
          <PerfectCircle
            color={new Color("#f76f6f")}
            onPress={this.props.onCategorizationStartPress}
          >
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
        <View style={{ flex: 1 }}></View>
      </View>
    );
  }
}
