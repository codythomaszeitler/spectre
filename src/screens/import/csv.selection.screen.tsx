import React, { Component } from "react";
import { View, Button } from "react-native";
import { CsvType, RAW_FORMAT } from "../../export/csv.type";
import { DocumentPicker } from "../document.picker.screen";
import { CATEGORY_BOX_HEIGHT, CATEGORY_BOX_INSET } from "../category.screen";
import {
  CsvToImport,
  OnCsvTypeSelectedEvent,
  OnCsvTypeSelectedListener,
} from "./csv.to.import";
import { CsvToImportLine } from "./csv.to.import.line.screen";
import {
  CsvPickerScreen,
  OnMultipleCsvsSelectedEvent,
  OnMultipleCsvsSelectedListener,
} from "./csv.picker.screen";

export interface State {
  csvsToImport: Array<CsvToImport>;
}

export class CsvSelectionScreen
  extends Component
  implements OnCsvTypeSelectedListener, OnMultipleCsvsSelectedListener {
  listeners: FileCsvTypeDuoSelectedListener[];

  constructor(props) {
    super(props);

    this.onFilesImportStart = this.onFilesImportStart.bind(this);
    this.onCsvsSelected = this.onCsvsSelected.bind(this);

    this.fileInputRef = React.createRef();

    this.listeners = [];
    if (this.props.onFileCsvTypeDuoSelectedListener) {
      this.listeners.push(this.props.onFileCsvTypeDuoSelectedListener);
    }

    this.state = {
      csvsToImport: [],
      currentFile: "",
    };
  }

  onCsvsSelected(event: OnMultipleCsvsSelectedEvent) {
    const csvsToImport = [...this.state.csvsToImport];

    const newCsvsToImport = event.csvsToImport;
    for (let i = 0; i < newCsvsToImport.length; i++) {
      const newCsvToImport = newCsvsToImport[i];
      newCsvToImport.addOnCsvTypeSelectedListener(this);
    }

    csvsToImport.push(...newCsvsToImport);

    this.setState({
      csvsToImport,
    });
  }

  onCsvTypeSeleted(event: OnCsvTypeSelectedEvent) {
    if (event.csvType.equals(RAW_FORMAT)) {
      for (let i = 0; i < this.state.csvsToImport.length; i++) {
        const csvToImport = this.state.csvsToImport[i];

        if (!csvToImport.csvType.equals(event.csvType)) {
          csvToImport.setCsvType(event.csvType.copy());
        }
      }
    }
  }

  onFilesImportStart() {
    const pairs = [];
    for (let i = 0; i < this.state.csvsToImport.length; i++) {
      const csvToImport = this.state.csvsToImport[i];
      pairs.push(csvToImport);
    }

    const event = new OnFilesWithCsvTypeSelectedEvent();
    event.pairs = pairs;

    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];
      listener.onFilesWithTypeSelectedListener(event);
    }
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
            flex: 0.175,
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
            {this.state.csvsToImport.map((csvToImport: CsvToImport) => {
              return (
                <CsvToImportLine csvToImport={csvToImport}></CsvToImportLine>
              );
            })}
            <CsvPickerScreen
              onCsvsSelectedListener={this}
              placeholderFilePath={"-------"}
            ></CsvPickerScreen>
          </View>
          <View
            style={{
              flex: 0.25,
            }}
          ></View>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
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
  pairs: CsvToImport[];
}
