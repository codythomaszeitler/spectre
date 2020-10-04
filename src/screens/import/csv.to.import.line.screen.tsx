import React, { Component } from "react";
import { View } from "react-native";
import { CsvFileSelectionScreen } from "./csv.file.selection.screen";
import { CsvTypeSelectionScreen } from "./csv.type.selection.screen";

export const CSV_IMPORT_LINE_HEIGHT = 75;

export class CsvToImportLine extends Component {
  render() {
    return (
      <View
        style={{
          width : '100%',
          height: CSV_IMPORT_LINE_HEIGHT,
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
            <CsvFileSelectionScreen
              csvToImport={this.props.csvToImport}
            ></CsvFileSelectionScreen>
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
              csvToImport={this.props.csvToImport}
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
