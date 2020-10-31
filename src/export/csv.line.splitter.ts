import { readString } from "react-papaparse";
import { escapeCsvElement, removeFirstCharacter } from "./csv.exporter";
import { unescapeCsvElement } from "./csv.importer";

export function readCsv(input: string) {
  const lines = [];

  const asPapaParse = readString(input);
  for (let i = 0; i < asPapaParse.data.length; i++) {
    const papaParseArray = asPapaParse.data[i];
    const line = csvLineWithEscapes(papaParseArray);
    lines.push(line);
  }
  return lines;
}

function csvLineWithEscapes(data: Array<string>) {
  let line = "";
  for (let i = 0; i < data.length; i++) {
    line = line + "," + escapeCsvElement(data[i]);
  }
  return removeFirstCharacter(line);
}

export function split(input: string) {
    if (!unescapeCsvElement(input)) {
        return [];
    }

  const asPapaParse = readString(input, { skipEmptyLines: true });
  if (asPapaParse.data.length > 1) {
    throw new Error(
      "Line had more than one line in it [" + asPapaParse.data.length + "]"
    );
  }

  const papaParseArray = asPapaParse.data[0];
  return papaParseArray;
}
