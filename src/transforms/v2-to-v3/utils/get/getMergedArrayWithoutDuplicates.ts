export const getMergedArrayWithoutDuplicates = <T>(arr1: T[], arr2: T[]) =>
  arr1.concat(arr2.filter((arr2Item) => arr1.indexOf(arr2Item) < 0));
