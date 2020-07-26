import React, { Component } from "react";
import { View, TouchableOpacity} from "react-native";
import {Icon} from 'react-native-elements';
import { Location } from "../service/location";

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
    console.log(this.fileInputRef);
    this.fileInputRef.current.click();
  }

  render() {
    return (
      <View style={{
        flex : 1
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#1FDA5D",
            borderColor: "#fff",
            justifyContent : 'center',
            width : '100%',
            height : '100%',
            borderRadius : 10
          }}
          onPress={this.onImportStart}
        >
          <Icon name={"add"} size={15} color="#fff" />
        </TouchableOpacity>
        <input
          type="file"
          width="100%"
          ref={this.fileInputRef}
          value={this.state.currentFile}
          onChange={this.onFilePick}
          style={{
            display : 'none'
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
