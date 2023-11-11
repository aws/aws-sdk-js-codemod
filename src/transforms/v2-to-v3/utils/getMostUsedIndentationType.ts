export enum IndentationType {
  TAB = "tab",
  SPACE = "space",
}

export const getMostUsedIndentationType = (source: string) => {
  const tabCount = (source.match(/\t/g) || []).length;
  const spaceCount = (source.match(/ {2}/g) || []).length;
  console.log({ tabCount, spaceCount });

  if (tabCount > spaceCount) {
    return IndentationType.TAB;
  }
  return IndentationType.SPACE;
};
