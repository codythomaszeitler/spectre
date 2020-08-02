import React, { Component } from "react";
import { View } from "react-native";
import { Image } from "react-native-elements";
import { Location } from "../service/location";
import { PerfectSquare } from "./perfect.square";
import { Color } from "../pojo/color";

export interface Props {
  onSuccessfulLoadListener: DocumentLoadedListener;
}

export class DocumentPicker extends Component {
  documentLoadedListeners: DocumentLoadedListener[];

  constructor(props: Props) {
    super(props);
    this.onFilePick = this.onFilePick.bind(this);
    this.onImportStart = this.onImportStart.bind(this);

    this.fileInputRef = React.createRef();

    this.documentLoadedListeners = [];
    if (props.onSuccessfulLoadListener) {
      this.documentLoadedListeners.push(props.onSuccessfulLoadListener);
    }

    this.state = {
      currentFile: "",
    };
  }

  onFileSelect(contents: File) {
    for (let i = 0; i < this.documentLoadedListeners.length; i++) {
      this.documentLoadedListeners[i].onFileSelect(
        new OnFileSelectedEvent(contents)
      );
    }
  }

  async onFilePick(event: Object) {
    const picked = event.target.files[0];
    this.onFileSelect(picked);
  }

  onImportStart() {
    this.fileInputRef.current.click();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <PerfectSquare
          onPress={this.onImportStart}
          color={new Color("#79D75D")}
          borderRadius={this.props.borderRadius}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/upload.png")}
              style={{
                width: 25,
                height: 25,
              }}
            ></Image>
          </View>
        </PerfectSquare>
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

export interface DocumentLoadedListener {
  onFileSelect: (event: OnFileSelectedEvent) => void;
}

export class OnFileSelectedEvent {
  file: File;
  constructor(file: File) {
    this.file = file;
  }
}
