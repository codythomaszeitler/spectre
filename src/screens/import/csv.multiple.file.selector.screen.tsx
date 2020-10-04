import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "./csv.file.selection.screen";

export interface Props {
  placeholderFilePath: string;
  onFilesSelectedListener: OnMultipleFilesSelectedListener;
}

export class CsvMultipleFileSelectorScreen extends Component {
  listeners: Array<OnMultipleFilesSelectedListener>;

  constructor(props: Props) {
    super(props);

    this.onFilePick = this.onFilePick.bind(this);

    this.fileInputRef = React.createRef();

    this.listeners = [];
    if (this.props.onFilesSelectedListener) {
      this.listeners.push(this.props.onFilesSelectedListener);
    }

    this.state = {
      currentFile: "",
    };
  }

  onFilePick(event: Object) {
    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];

      const filesSelectedEvent = new OnMultipleFilesSelectedEvent();
      filesSelectedEvent.files = event.target.files;
      listener.onFilesSelectedListener(filesSelectedEvent);
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "grey",
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
          <Text style={styles.font}>{this.props.placeholderFilePath}</Text>
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
          multiple
        ></input>
      </View>
    );
  }
}

export interface OnMultipleFilesSelectedListener {
  onFilesSelectedListener: (event: OnMultipleFilesSelectedEvent) => void;
}

export class OnMultipleFilesSelectedEvent {
  files: Array<File>;

  constructor() {
    this.files = [];
  }
}
