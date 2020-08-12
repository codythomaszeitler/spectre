import React, { Component } from "react";
import { View, Image } from "react-native";
import { Text } from "react-native-elements";
import { DocumentPicker } from "./document.picker.screen";
import { ExportButtonScreen } from "./export.button.screen";
import { PerfectCircle } from "./perfect.circle";
import { Color } from "./../pojo/color";
import { BoldFontFamily } from "../css/styles";
import { CATEGORY_BOX_INSET, CATEGORY_BOX_HEIGHT } from "./category.screen";
import { PaypalButtonScreen } from "./donation.screen";
import { isMobile, isBrowser } from "react-device-detect";

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
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              width: CATEGORY_BOX_HEIGHT,
              height: CATEGORY_BOX_HEIGHT,
              borderRadius: CATEGORY_BOX_INSET,
              alignContent: "center",
              justifyContent: "center",
              overflow : 'hidden'
            }}
          >
            <DocumentPicker
              onSuccessfulLoadListener={this.props.onSuccessfulLoadListener}
            ></DocumentPicker>
          </View>
          <View
            style={{
              width: 5,
            }}
          ></View>
          <View
            style={{
              width: CATEGORY_BOX_HEIGHT,
              height: CATEGORY_BOX_HEIGHT,
              borderRadius: CATEGORY_BOX_INSET,
              alignContent: "center",
              justifyContent: "center",
              overflow : 'hidden'
            }}
          >
            <ExportButtonScreen
              onPress={this.props.onExportButtonPress}
            ></ExportButtonScreen>
          </View>
          {/* <DocumentPicker
              borderRadius={CATEGORY_BOX_INSET}
              onSuccessfulLoadListener={this.props.onSuccessfulLoadListener}
            ></DocumentPicker> */}
          {/* <View
            style={{
              width: 5,
            }}
          ></View> */}
          {/* <View
            style={{
              alignSelf: "center",
              borderRadius: CATEGORY_BOX_INSET,
              width: CATEGORY_BOX_HEIGHT,
              height: CATEGORY_BOX_HEIGHT,
            }}
          >
            <ExportButtonScreen
              borderRadius={CATEGORY_BOX_INSET}
              onPress={this.props.onExportButtonPress}
            ></ExportButtonScreen>
          </View> */}
        </View>
        <View
          style={{
            flex: 3,
            marginTop: 27,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <PaypalButtonScreen></PaypalButtonScreen>
        </View>
        <View
          style={{
            flex: 1.5,
          }}
        ></View>

        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "center",
            flex: 3,
            width: "85%",
            height: "85%",
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
                fontFamily: BoldFontFamily,
                fontSize: isMobile ? 16 : 32,
              }}
            >
              {this.props.numUncategorized}
            </Text>
          </PerfectCircle>
        </View>
        <View style={{ flex: isMobile ? 1 : 0.5 }}></View>
      </View>
    );
  }
}
