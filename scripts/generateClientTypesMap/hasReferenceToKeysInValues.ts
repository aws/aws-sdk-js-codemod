/**
 * Checks if any of the values in the clientTypesMap has a reference to any of the keys.
 * Reference is defined as key name inside brackets, i.e. `<key>` for `key`.
 */
export const hasReferenceToKeysInValues = (clientTypesMap: Record<string, string>) => {
  const keys = Object.keys(clientTypesMap);
  for (const value of Object.values(clientTypesMap)) {
    if (keys.some((key) => value.includes(`Array<${key}>`))) {
      return true;
    }
  }
  return false;
};
