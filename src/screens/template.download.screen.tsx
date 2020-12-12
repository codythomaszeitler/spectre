import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CATEGORY_BOX_INSET, CATEGORY_FONT_SIZE } from "./category.screen";
import { FontFamily } from "../css/styles";
import { Color } from "../pojo/color";
import { Asset } from "expo-asset";
import { LocalFileLocation } from "../service/local.file.location";

export interface Props {
  name: string;
  color: Color;
}

export class TemplateDownloadScreen extends Component<Props> {

  constructor(props : Props) {
    super(props);
    this.download = this.download.bind(this);
  }

  async download() {
    const contents = this.props.resource.contents.contents;
    console.log(contents);
    const file = new File([], 'sample.csv');
    const locationFileLocation = new LocalFileLocation(file);
    locationFileLocation.write([JSON.stringify(contents)]);
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
            width: "44%",
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
              fontSize: CATEGORY_FONT_SIZE,
              fontFamily: FontFamily,
              marginLeft: 8,
            }}
          >
            {this.props.name}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: "32%",
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
