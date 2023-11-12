import { EOL } from "os";

const INDENTATION_REGEX = /^(\t*)( {4})/;

export const getValueIndentedWithTabs = (value: string) => {
  const lines: string[] = [];

  for (const line of value.split(EOL)) {
    const match = line.match(INDENTATION_REGEX);
    if (match) {
      const numberOfTabs = match[1].length;
      const numberOfSpaces = match[2].length;
      const numberOfIndents = numberOfTabs + numberOfSpaces / 4;
      lines.push("\t".repeat(numberOfIndents) + line.trimLeft());
    } else {
      lines.push(line);
    }
  }

  return lines.join(EOL);
};
