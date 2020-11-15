import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CATEGORY_BOX_INSET, CATEGORY_FONT_SIZE } from "./category.screen";
import { isMobile } from "react-device-detect";
import { FontFamily } from "../css/styles";
import { Color } from "../pojo/color";
import * as FileSystem from "expo-file-system";

export interface Props {
  name: string;
  color: Color;
}

export class TemplateDownloadScreen extends Component<Props> {
  download() {
      console.log(FileSystem.documentDirectory);
    FileSystem.downloadAsync(
        "./",
      FileSystem.documentDirectory + "small.mp4"
    )
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
          alignSelf: "flex-start",
          justifyContent: "flex-start",
          height: 50,
        }}
      >
        <View
          style={{
            width: "12%",
            height: "100%",
          }}
        ></View>
        <TouchableOpacity
          style={{
            width: "38%",
            height: "100%",
            backgroundColor: this.props.color.hex(),
            borderRadius: CATEGORY_BOX_INSET,
            justifyContent: "center",
          }}
          onPress={this.download}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: isMobile ? CATEGORY_FONT_SIZE : CATEGORY_FONT_SIZE,
              fontFamily: FontFamily,
              marginLeft: 8,
            }}
          >
            {this.props.name}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: "38%",
            height: "100%",
          }}
        ></View>
        <View
          style={{
            width: "12%",
            height: "100%",
          }}
        ></View>
      </View>
    );
  }
}
