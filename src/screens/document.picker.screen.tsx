import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { Color } from "../pojo/color";
import { isMobile } from "react-device-detect";

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
      <TouchableOpacity onPress={this.onImportStart} style={{
        flex : 1
      }}>
        <View
          style={{
            flex: 1,
            backgroundColor: new Color("#79D75D").hex(),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/upload.png")}
            resizeMode='contain'
            style={{
              width: isMobile ? 10 : 21,
              height: isMobile ? 15 : 25
            }}
          ></Image>
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
      </TouchableOpacity>
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
