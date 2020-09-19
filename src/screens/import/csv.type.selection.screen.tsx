import React, { Component } from "react";
import { View, Image } from "react-native";
import { CsvType } from "../../export/csv.type";
import { MasterBankConfigParser } from "../../mappings/master.bank.config.parser";
import { MasterBankConfig } from "../../mappings/master.bank.config";
import {BankConfig} from "../../mappings/bank.config";
import { Picker } from "@react-native-community/picker";

export class CsvTypeSelectionScreen extends Component {
  listeners: CsvTypeSelectedListener[];

  masterMappingInfo: MasterBankConfigParser;

  constructor(props) {
    super(props);

    this.listeners = [];
    if (this.props.onCsvTypeSelectedListener) {
      this.listeners.push(this.props.onCsvTypeSelectedListener);
    }

    this.masterMappingInfo = new MasterBankConfigParser(MasterBankConfig);
    const defaultConfig = this.masterMappingInfo.getDefaultConfig();

    this.state = {
      currentChoice: defaultConfig.getName(),
      currentImage: defaultConfig.getFilePath(),
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
              source={this.state.currentImage}
              resizeMode="cover"
              style={{
                width: 30,
                height: 30,
              }}
            ></Image>
          </View>
          <View
            style={{
              flex: .25,
            }}
          ></View>
          <View
            style={{
              flex: 3,
            }}
          >
           <Picker
              selectedValue={this.state.currentChoice}
              style={{ flex: 1, borderColor: "white", fontSize : 18 }}
              onValueChange={(itemValue: string) => {
                const config = this.masterMappingInfo.getConfigFor(itemValue);
                this.setState({
                  currentChoice: itemValue,
                  currentImage: config.getFilePath(),
                });
                this.onCsvTypeSelected(itemValue);
              }}
            >
              {this.masterMappingInfo
                .getConfigs()
                .map((currentValue: BankConfig) => {
                  return (
                    <Picker.Item
                      label={currentValue.getName()}
                      value={currentValue.getName()}
                    />
                  );
                })}
            </Picker>
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
