import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { Color } from "../pojo/color";
import { isMobile } from "react-device-detect";
export class DocumentPicker extends Component {

  render() {
    return (
      <TouchableOpacity onPress={this.props.onImportButtonPress} style={{
        flex : 1
      }}>
        <View
          style={{
            flex: 1,
            backgroundColor: new Color("#79D75D").hex(),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/upload.png")}
            resizeMode='contain'
            style={{
              width: isMobile ? 10 : 21,
              height: isMobile ? 15 : 25
            }}
          ></Image>

        </View>
      </TouchableOpacity>
    );
  }
}


