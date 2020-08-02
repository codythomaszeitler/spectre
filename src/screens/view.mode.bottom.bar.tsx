import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { DocumentPicker } from "./document.picker.screen";
import { ExportButtonScreen } from "./export.button.screen";
import { PerfectCircle } from "./perfect.circle";
import { Color } from "./../pojo/color";
import { FontFamily } from "../css/styles";
import { CATEGORY_BOX_INSET, CATEGORY_BOX_HEIGHT } from "./category.screen";

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
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              width: CATEGORY_BOX_HEIGHT,
              height: CATEGORY_BOX_HEIGHT,
              borderRadius : CATEGORY_BOX_INSET
            }}
          >
            <DocumentPicker
              borderRadius={CATEGORY_BOX_INSET}
              onSuccessfulLoadListener={this.props.onSuccessfulLoadListener}
            ></DocumentPicker>
          </View>
          <View
            style={{
              width : 5
            }}
          ></View>
          <View
            style={{
              alignSelf: "center",
              borderRadius : CATEGORY_BOX_INSET,
              width: CATEGORY_BOX_HEIGHT,
              height: CATEGORY_BOX_HEIGHT,
            }}
          >
            <ExportButtonScreen
            borderRadius={CATEGORY_BOX_INSET}
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
            color={new Color("#FF7676")}
            onPress={this.props.onCategorizationStartPress}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "white",
                fontFamily: FontFamily,
                fontSize: 32,
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
