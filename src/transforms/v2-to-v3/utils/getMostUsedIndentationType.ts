import { EOL } from "node:os";

export enum IndentationType {
  TAB = "tab",
  SPACE = "space",
}

export const getMostUsedIndentationType = (source: string) => {
  let tabCount = 0;
  let spaceCount = 0;

  for (const line of source.split(EOL)) {
    if (line.startsWith(" ")) {
      spaceCount++;
    } else if (line.startsWith("\t")) {
      tabCount++;
    }
  }

  if (tabCount > spaceCount) {
    return IndentationType.TAB;
  }
  return IndentationType.SPACE;
};
