import { CsvType } from "../../export/csv.type";

export interface OnCsvFileSelectedListener {
  onCsvFileSeleted: (event: OnCsvFileSelectedEvent) => void;
}

export class OnCsvFileSelectedEvent {
  file: File;
}

export interface OnCsvTypeSelectedListener {
  onCsvTypeSeleted: (event: OnCsvTypeSelectedEvent) => void;
}

export class OnCsvTypeSelectedEvent {
    csvType : CsvType;
}

export class CsvToImport {
  file: File;
  onFileSetListeners: Array<OnCsvFileSelectedListener>;
  currentListenerId: number;

  csvType: CsvType;
  onCsvSetListeners : Array<OnCsvTypeSelectedListener>;

  constructor() {
    this.file = new File(
      ["You should have never have read this file"],
      "File Never Set",
      { type: "text/html" }
    );

    this.onFileSetListeners = [];
    this.onCsvSetListeners= [];
    this.currentListenerId = 0;
  }

  addOnCsvFileSelectedListener(listener: OnCsvFileSelectedListener) {
    listener.__listenerId = this.currentListenerId;
    this.currentListenerId++;
    this.onFileSetListeners.push(listener);
  }

  removeOnCsvFileSelectedListener(listener: OnCsvFileSelectedListener) {
    this.onFileSetListeners = this.onFileSetListeners.filter(
      (inner: OnCsvFileSelectedListener) => {
        return listener.__listenerId !== inner.__listenerId;
      }
    );
  }

  setImportFile(file: File) {
    if (!file) {
      throw new Error("Cannot set with a falsy file");
    }

    this.file = file;

    for (let i = 0; i < this.onFileSetListeners.length; i++) {
      const event = new OnCsvFileSelectedEvent();
      event.file = file;

      const listener = this.onFileSetListeners[i];
      listener.onCsvFileSeleted(event);
    }
  }

  getImportFile() {
    return this.file;
  }

  addOnCsvTypeSelectedListener(listener: OnCsvTypeSelectedListener) {
    listener.__listenerId = this.currentListenerId;
    this.currentListenerId++;
    this.onCsvSetListeners.push(listener);

    this.emitCsvTypeChangedEvent();
  }

  removeOnCsvTypeSelectedListener(listener: OnCsvTypeSelectedListener) {
    this.onCsvSetListeners = this.onCsvSetListeners.filter(
      (inner: OnCsvTypeSelectedListener) => {
        return listener.__listenerId !== inner.__listenerId;
      }
    );
  }

  setCsvType(csvType: CsvType) {

    if (!csvType) {
        throw new Error('Cannot set with a falsy csv type');
    }

    this.csvType = csvType.copy();

    this.emitCsvTypeChangedEvent(); 
  }

  emitCsvTypeChangedEvent() {
    if (!this.csvType) {
      return;
    }

    for (let i = 0; i < this.onCsvSetListeners.length; i++) {
        const event = new OnCsvTypeSelectedEvent();
        event.csvType = this.csvType.copy();

        const listener = this.onCsvSetListeners[i];
        listener.onCsvTypeSeleted(event);
    }
  }

  getCsvType() {
    return this.csvType.copy();
  }
}
