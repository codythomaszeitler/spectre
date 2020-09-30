import React, { Component } from "react";
import { View, Text } from "react-native";
import { CsvTypeSelectionScreen } from "./csv.type.selection.screen";
import { TouchableOpacity } from "react-native";
import { BoldFontFamily } from "../../css/styles";

export class CsvMultipleSelectionLine extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 5,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "grey",
                flexDirection: "row",
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  flex: 0.25,
                }}
              ></View>
              <TouchableOpacity
                style={{
                  flex: 5,
                  justifyContent: "center",
                }}
                onPress={() => {
                  this.fileInputRef.current.click();
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: BoldFontFamily,
                    fontSize: 18,
                  }}
                >
                    {""}
                </Text>
              </TouchableOpacity>
              <input
                type="file"
                width="100%"
                ref={this.fileInputRef}
                value={this.state.currentFile}
                onChange={this.onFilePick}
                style={{
                  display: "none",
                }}
              ></input>
            </View>
          </View>

          <View
            style={{
              flex: 0.5,
            }}
          ></View>

          <View
            style={{
              flex: 2,
            }}
          >
            <CsvTypeSelectionScreen
              onCsvTypeSelectedListener={this}
              id={i}
            ></CsvTypeSelectionScreen>
          </View>
        </View>
        <View
          style={{
            flex: 0.25,
          }}
        ></View>
      </View>
    );
  }
}
