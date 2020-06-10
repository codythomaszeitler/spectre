import React, { Component } from "react";
import { View } from "react-native";
import { LocalFileLocation } from "../service/local.file.location";
import { DocumentLoadService, Location } from "../service/document.load.service";

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

  onSuccessfulFileLoad(contents: string[]) {
    for (let i = 0; i < this.documentLoadedListeners.length; i++) {
      this.documentLoadedListeners[i].onSuccessfulLoad(new OnDocumentLoadedEvent(contents));
    }
  }

  async onFilePick(event : Object) {
    const picked = event.target.files[0];

    const location : Location = new LocalFileLocation(picked);
    const loader : DocumentLoadService = new DocumentLoadService(location);

    const lines = await loader.fetchall();
    this.onSuccessfulFileLoad(lines);
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
    contents : string[];
    constructor(contents : string[]) {
        this.contents = contents;
    }
}