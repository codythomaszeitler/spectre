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

export interface State {
  csvsToImport: Array<CsvToImport>;
}

export class CsvSelectionScreen
  extends Component
  implements OnCsvTypeSelectedListener {
  listeners: FileCsvTypeDuoSelectedListener[];

  constructor(props) {
    super(props);

    this.onFilesImportStart = this.onFilesImportStart.bind(this);
    this.onFilePick = this.onFilePick.bind(this);

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

  onFilePick(event: Object) {
    const files = event.target.files;

    const csvsToImport = [...this.state.csvsToImport];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const csvToImport = new CsvToImport();
      csvToImport.setImportFile(file);
      csvToImport.setCsvType(new CsvType("Chase"));

      csvToImport.addOnCsvTypeSelectedListener(this);

      csvsToImport.push(csvToImport);
    }

    this.setState({
      csvsToImport : csvsToImport
    });
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
            flex: 0.5,
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
          </View>
          <View
            style={{
              flex: 0.25,
            }}
          ></View>
        </View>

        <Button
          title="Click me to start importing"
          onPress={() => {
            this.fileInputRef.current.click();
          }}
        ></Button>

        <input
          type="file"
          width="100%"
          ref={this.fileInputRef}
          value={this.state.currentFile}
          onChange={this.onFilePick}
          style={{
            display: "none",
          }}
          multiple
        ></input>

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