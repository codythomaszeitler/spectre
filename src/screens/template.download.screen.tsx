import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CATEGORY_BOX_INSET, CATEGORY_FONT_SIZE } from "./category.screen";
import { FontFamily } from "../css/styles";
import { Color } from "../pojo/color";
import FileSaver from "file-saver";

export interface Props {
  name: string;
  color: Color;
  disabled?: boolean;
  downloadFileName: string;
  resource: string;
}

export class TemplateDownloadScreen extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.download = this.download.bind(this);
  }

  async download() {
    try {
      const result = await fetch(this.props.resource, {
        mode: "cors",
      });
      FileSaver.saveAs(await result.blob(), this.props.downloadFileName);
    } catch (e) {
      console.log(e);
    }
  }

  private getOpacity() {
    if (this.props.disabled) {
      return 0.5;
    } else {
      return 1;
    }
  }

  render() {
    return (
      <View
        style={{
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
        {!this.props.disabled && (
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
        )}

        {this.props.disabled && (
          <View
            style={{
              width: "44%",
              height: "100%",
              backgroundColor: this.props.color.hex(),
              borderRadius: CATEGORY_BOX_INSET,
              justifyContent: "center",
              opacity: this.getOpacity(),
            }}
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
          </View>
        )}
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
