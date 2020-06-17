import React, { Component } from "react";
import { View } from "react-native";
import { LocalFileLocation } from "../service/local.file.location";
import { DocumentLoadService } from "../service/document.load.service";
import { Location } from "../service/location";

export interface Props {
  onSuccessfulLoadListener: DocumentLoadedListener;
}

export class DocumentPicker extends Component {
  documentLoadedListeners: DocumentLoadedListener[];

  constructor(props: Props) {
    super(props);
    this.onFilePick = this.onFilePick.bind(this);

    this.documentLoadedListeners = [];
    if (props.onSuccessfulLoadListener) {
      this.documentLoadedListeners.push(props.onSuccessfulLoadListener);
    }

    this.state = {
      currentFile : ''
    }
  }

  onFileSelect(contents: File){
    for (let i = 0; i < this.documentLoadedListeners.length; i++) {
      this.documentLoadedListeners[i].onFileSelect(new OnFileSelectedEvent(contents));
    }
  }

  async onFilePick(event : Object) {
    const picked = event.target.files[0];
    this.onFileSelect(picked);
  }

  render() {
    return (
      <View>
        <input type="file" width="100%" value={this.state.currentFile} onChange={this.onFilePick}></input>
      </View>
    );
  }
}

export interface DocumentLoadedListener {
  onFileSelect: (event: OnFileSelectedEvent) => void;
}

export class OnFileSelectedEvent {
    file : File;
    constructor(file: File) {
        this.file= file;
    }
}