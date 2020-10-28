import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { BoldFontFamily } from "../../css/styles";
import { CsvToImport } from "./csv.to.import";

export interface Props {
  csvToImport: CsvToImport;
}

export class CsvFileSelectionScreen extends Component {
  constructor(props: Props) {
    super(props);

    this.onFilePick = this.onFilePick.bind(this);

    this.fileInputRef = React.createRef();

    this.listeners = [];
    if (this.props.onFileSelectedListener) {
      this.listeners.push(this.props.onFileSelectedListener);
    }

    this.state = {
      selectedFilePath: this.props.csvToImport.getImportFile().name,
      currentFile: "",
    };
  }

  onFilePick(event: Object) {
    this.setState({
      selectedFilePath: event.target.files[0].name,
    });

    this.props.csvToImport.setImportFile(event.target.files[0]);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#A2A2A2",
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
            style={styles.font}
          >
            {this.state.selectedFilePath}
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
    );
  }
}

export const styles = StyleSheet.create({
  font: {
    color: "white",
    fontFamily: BoldFontFamily,
    fontSize: 18,
  },
});
