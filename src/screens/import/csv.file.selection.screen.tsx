import React, { Component } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity, TextInput } from "react-native";
import { BoldFontFamily } from "../../css/styles";

export class CsvFileSelectionScreen extends Component {
  listeners: FileSelectedListener[];

  constructor(props) {
    super(props);

    this.onFilePick = this.onFilePick.bind(this);

    this.fileInputRef = React.createRef();

    this.listeners = [];
    if (this.props.onFileSelectedListener) {
      this.listeners.push(this.props.onFileSelectedListener);
    }

    this.state = {
      currentFile: "",
      selectedFilePath : "Select a file..."
    };
  }

  onFilePick(event: Object) {
    for (let i = 0; i < this.listeners.length; i++) {
      const fileSelectedEvent = new OnFileSelectedEvent(event.target.files[0]);
      fileSelectedEvent.id = this.props.id;

      const listener = this.listeners[i];
      listener.onFileSelect(fileSelectedEvent);
    }

    this.setState({
        selectedFilePath : event.target.files[0].name
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "grey",
          flexDirection: "row",
          borderRadius : 5
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
            <Text style={{
                color : 'white',
                fontFamily : BoldFontFamily,
                fontSize : 18
            }}>
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

export interface FileSelectedListener {
  onFileSelect: (event: OnFileSelectedEvent) => void;
}

export class OnFileSelectedEvent {
  file: File;
  id: number;

  constructor(file: File) {
    this.file = file;
  }
}
