import React, { Component } from "react";
import { View } from "react-native";
import { OnCategoryAddedEvent } from "../pojo/spectre.user";

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
  }

  onSuccessfulFileLoad(contents: string) {
    for (let i = 0; i < this.documentLoadedListeners.length; i++) {
      this.documentLoadedListeners[i].onSuccessfulLoad(new OnDocumentLoadedEvent(contents));
    }
  }

  onFilePick(event) {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const contents = event.target.result;
      this.onSuccessfulFileLoad(contents);
    });

    reader.readAsBinaryString(event.target.files[0]);
  }

  render() {
    return (
      <View>
        <input type="file" width="100%" onChange={this.onFilePick}></input>
      </View>
    );
  }
}

export interface DocumentLoadedListener {
  onSuccessfulLoad: (event: OnDocumentLoadedEvent) => void;
}

export class OnDocumentLoadedEvent {
    contents : string;
    constructor(contents : string) {
        this.contents = contents;
    }
}