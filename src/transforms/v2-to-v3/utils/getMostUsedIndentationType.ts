export enum IndentationType {
  TAB = "tab",
  SPACE = "space",
}

export const getMostUsedIndentationType = (source: string) => {
  const tabCount = (source.match(/\n\t/g) || []).length;
  const spaceCount = (source.match(/\n {2}/g) || []).length;

  if (tabCount > spaceCount) {
    return IndentationType.TAB;
  }
  return IndentationType.SPACE;
};
