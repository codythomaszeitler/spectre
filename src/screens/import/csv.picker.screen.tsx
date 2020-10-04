import React, { Component } from "react";
import { View } from "react-native";
import {
  CsvMultipleFileSelectorScreen,
  OnMultipleFilesSelectedEvent,
  OnMultipleFilesSelectedListener,
} from "./csv.multiple.file.selector.screen";
import { CsvToImport } from "./csv.to.import";
import { CsvTypeSelectionScreen } from "./csv.type.selection.screen";
import { CSV_IMPORT_LINE_HEIGHT } from "./csv.to.import.line.screen";
import { MasterBankConfig } from "../../mappings/master.bank.config";
import { MasterBankConfigParser } from "../../mappings/master.bank.config.parser";
import { CsvType } from "../../export/csv.type";

export interface Props {
  onCsvsSelectedListener: OnMultipleCsvsSelectedListener;
}

export interface State {
  csvToImport: CsvToImport;
}

export class CsvPickerScreen
  extends Component
  implements OnMultipleFilesSelectedListener {
  listeners: Array<OnMultipleCsvsSelectedListener>;

  constructor(props: Props) {
    super(props);

    const masterConfig = new MasterBankConfigParser(MasterBankConfig);
    const defaultConfig = masterConfig.getDefaultConfig();

    const csvToImport = new CsvToImport();
    csvToImport.setCsvType(new CsvType(defaultConfig.getName()));

    this.listeners = [];
    if (this.props.onCsvsSelectedListener) {
      this.listeners.push(this.props.onCsvsSelectedListener);
    }

    this.state = {
      csvToImport,
    };
  }

  onFilesSelectedListener(event: OnMultipleFilesSelectedEvent) {
    const currentlySelectedType = this.state.csvToImport.getCsvType();

    const files = event.files;

    const csvsToImport = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const csvToImport = new CsvToImport();
      csvToImport.setImportFile(file);
      csvToImport.setCsvType(currentlySelectedType);

      csvsToImport.push(csvToImport);
    }

    for (let i = 0; i < this.listeners.length; i++) {
      const onCsvsSelectedEvent = new OnMultipleCsvsSelectedEvent();
      onCsvsSelectedEvent.csvsToImport = csvsToImport;

      const listener = this.listeners[i];
      listener.onCsvsSelected(onCsvsSelectedEvent);
    }
  }

  render() {
    return (
      <View
        style={{
          width: "100%",
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
            <CsvMultipleFileSelectorScreen
              onFilesSelectedListener={this}
              placeholderFilePath={this.props.placeholderFilePath}
            ></CsvMultipleFileSelectorScreen>
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
              csvToImport={this.state.csvToImport}
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

export interface OnMultipleCsvsSelectedListener {
  onCsvsSelected: (event: OnMultipleCsvsSelectedEvent) => void;
}

export class OnMultipleCsvsSelectedEvent {
  csvsToImport: Array<CsvToImport>;
  constructor() {
    this.csvsToImport = [];
  }
}
