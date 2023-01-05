import { hasReferenceToKeysInValues } from "./hasReferenceToKeysInValues";

/**
 * Checks if any of the values have reference to key, and replaces them recursively.
 */
export const getClientTypesMapWithKeysRemovedFromValues = (
  clientTypesMap: Record<string, string>
) => {
  if (!hasReferenceToKeysInValues(clientTypesMap)) {
    return clientTypesMap;
  }

  const newClientTypeMap = {};
  const keys = Object.keys(clientTypesMap);

  for (const [key, value] of Object.entries(clientTypesMap)) {
    const refs = keys.filter((key) => value.includes(`<${key}>`));
    if (refs.length === 0) {
      newClientTypeMap[key] = value;
    } else {
      newClientTypeMap[key] = refs.reduce(
        (acc, ref) => acc.replace(`<${ref}>`, `<${clientTypesMap[ref]}>`),
        value
      );
    }
  }

  return getClientTypesMapWithKeysRemovedFromValues(newClientTypeMap);
};
