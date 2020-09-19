import React, { Component } from "react";
import { View } from "react-native";
import {
  CsvFileSelectionScreen,
  OnFileSelectedEvent,
} from "./csv.file.selection.screen";
import { FileSelectedListener } from "./csv.file.selection.screen";
import {
  CsvTypeSelectionScreen,
  CsvTypeSelectedListener,
  OnCsvTypeSelectedEvent,
} from "./csv.type.selection.screen";
import { CsvType } from "../../export/csv.type";
import { DocumentPicker } from "../document.picker.screen";
import { CATEGORY_BOX_HEIGHT, CATEGORY_BOX_INSET } from "../category.screen";

export class CsvSelectionScreen
  extends Component
  implements FileSelectedListener, CsvTypeSelectedListener {
  selectedFiles: Map<number, File>;
  selectedTypes: Map<number, CsvType>;

  listeners: FileCsvTypeDuoSelectedListener[];
  numFileSelections: number;

  constructor(props) {
    super(props);

    this.onFilesImportStart = this.onFilesImportStart.bind(this);

    this.listeners = [];
    if (this.props.onFileCsvTypeDuoSelectedListener) {
      this.listeners.push(this.props.onFileCsvTypeDuoSelectedListener);
    }

    this.numFileSelections = 10;

    this.selectedFiles = {};

    this.selectedTypes = {};
    for (let i = 0; i < this.numFileSelections; i++) {
      this.selectedTypes[i] = new CsvType("Chase");
    }
  }

  onFilesImportStart() {
    const event = new OnFilesWithCsvTypeSelectedEvent();

    const pairs = [];
    for (const [identifier, file] of Object.entries(this.selectedFiles)) {
      const csvType = this.selectedTypes[identifier];
      pairs.push(new CsvSelectionPair(file, csvType));
    }
    event.pairs = pairs;

    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];
      listener.onFilesWithTypeSelectedListener(event);
    }
  }

  onFileSelect(event: OnFileSelectedEvent) {
    this.selectedFiles[event.id] = event.file;
  }

  onCsvTypeSelected(event: OnCsvTypeSelectedEvent) {
    this.selectedTypes[event.id] = event.csvType;
  }

  fileSelections() {
    const fileSelections = [];

    for (let i = 0; i < this.numFileSelections; i++) {
      fileSelections.push(
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
              <CsvFileSelectionScreen
                onFileSelectedListener={this}
                id={i}
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

    return fileSelections;
  }

  render() {
    return (
      <View
        style={{
          width: 500,
          height: 800,
          backgroundColor: "white",
          borderColor: "grey",
          borderWidth: 10,
          borderRadius: 15,
        }}
      >
        <View
          style={{
            flex: .5,
          }}
        ></View>

        <View style={{ flex: 5, flexDirection: "row" }}>
          <View
            style={{
              flex: 0.25,
            }}
          ></View>
          <View
            style={{
              flex: 5,
            }}
          >
            {this.fileSelections()}
          </View>
          <View
            style={{
              flex: 0.25,
            }}
          ></View>
        </View>


        <View style={{
            flex : 1, 
            justifyContent : 'center',
            alignSelf : 'center'
        }}>
          <View
            style={{
              width: CATEGORY_BOX_HEIGHT + 6,
              height: CATEGORY_BOX_HEIGHT,
              borderRadius: CATEGORY_BOX_INSET,
              alignContent: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <DocumentPicker
              onImportButtonPress={this.onFilesImportStart}
            ></DocumentPicker>
          </View>
        </View>

      </View>
    );
  }
}

export interface FileCsvTypeDuoSelectedListener {
  onFilesWithTypeSelectedListener: (
    event: OnFilesWithCsvTypeSelectedEvent
  ) => void;
}

export class OnFilesWithCsvTypeSelectedEvent {
  pairs: CsvSelectionPair[];
}

class CsvSelectionPair {
  file: File;
  supportedType: CsvType;

  constructor(file: File, supportedType: CsvType) {
    this.file = file;
    this.supportedType = supportedType;
  }
}
