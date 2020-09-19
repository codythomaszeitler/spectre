import React, { Component } from "react";
import { View, Image } from "react-native";
import { CsvType } from "../../export/csv.type";
import { MasterBankConfigParser } from "../../mappings/master.bank.config.parser";
import { MasterBankConfig } from "../../mappings/master.bank.config";
import { BankConfig } from "../../mappings/bank.config";

export class CsvTypeSelectionScreen extends Component {
  listeners: CsvTypeSelectedListener[];

  masterMappingInfo: MasterMappingInfo;

  constructor(props) {
    super(props);

    this.listeners = [];
    if (this.props.onCsvTypeSelectedListener) {
      this.listeners.push(this.props.onCsvTypeSelectedListener);
    }

    this.masterMappingInfo = new MasterBankConfigParser(MasterBankConfig);

    const defaultMapping = this.masterMappingInfo.getDefaultConfigName();
    const config = this.masterMappingInfo.getConfigFor(defaultMapping);

    this.state = {
      currentChoice: defaultMapping,
      imageFilePath: config.getFilePath(),
    };
  }

  onCsvTypeSelected(type: string) {
    const csvType = new CsvType(type);

    const event = new OnCsvTypeSelectedEvent();
    event.csvType = csvType;
    event.id = this.props.id;

    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];
      listener.onCsvTypeSelected(event);
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          borderRadius: 3,
          borderStyle: "solid",
          borderColor: "black",
          backgroundColor: "blue",
        }}
      >
        <View
          style={{
            flex: 0.25,
          }}
        ></View>

        <View
          style={{
            flex: 3,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../../../" + this.state.imageFilePath)}
              resizeMode="center"
              style={{
                width: 50,
                height: 50,
              }}
            ></Image>
          </View>
          <View
            style={{
              flex: 1,
            }}
          ></View>
          <View
            style={{
              flex: 3,
            }}
          >
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

export interface CsvTypeSelectedListener {
  onCsvTypeSelected: (event: OnCsvTypeSelectedEvent) => void;
}

export class OnCsvTypeSelectedEvent {
  csvType: CsvType;
  id: number;
}
