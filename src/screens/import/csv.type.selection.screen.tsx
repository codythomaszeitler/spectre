import React, { Component } from "react";
import { View, Image } from "react-native";
import { CsvType } from "../../export/csv.type";
import { MasterBankConfigParser } from "../../mappings/master.bank.config.parser";
import { MasterBankConfig } from "../../mappings/master.bank.config";
import { BankConfig } from "../../mappings/bank.config";
import { Picker } from "@react-native-community/picker";
import {
  OnCsvTypeSelectedEvent,
  OnCsvTypeSelectedListener,
} from "./csv.to.import";

export class CsvTypeSelectionScreen
  extends Component
  implements OnCsvTypeSelectedListener {
  masterMappingInfo: MasterBankConfigParser;

  constructor(props) {
    super(props);

    this.masterMappingInfo = new MasterBankConfigParser(MasterBankConfig);
    const config = this.masterMappingInfo.getConfigFor(
      this.props.csvToImport.getCsvType().get()
    );

    this.state = {
      currentChoice: config.getName(),
      currentImage: config.getFilePath(),
    };
  }

  componentDidMount() {
    this.props.csvToImport.addOnCsvTypeSelectedListener(this);
  }

  componentWillUnmount() {
    this.props.csvToImport.removeOnCsvTypeSelectedListener(this);
  }

  onCsvTypeSeleted(event: OnCsvTypeSelectedEvent) {
    const config = this.masterMappingInfo.getConfigFor(event.csvType.get());
    this.setState({
      currentChoice: event.csvType.get(),
      currentImage: config.getFilePath(),
    });
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
              flex: .9,
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
          {/* <View
            style={{
              flex: 0.5,
            }}
          ></View> */}
          <View
            style={{
              flex: 3,
            }}
          >
            <Picker
              selectedValue={this.state.currentChoice}
              style={{ flex: 1, borderColor: "#F5F5F5", fontSize: 18, backgroundColor :'#F5F5F5' }}
              onValueChange={(itemValue: string) => {
                this.props.csvToImport.setCsvType(new CsvType(itemValue));
              }}
            >
              {this.masterMappingInfo
                .getConfigs()
                .map((currentValue: BankConfig) => {
                  return (
                    <Picker.Item
                    key={currentValue.getName()}
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
