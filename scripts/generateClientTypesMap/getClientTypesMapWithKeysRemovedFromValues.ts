import { hasKeyReferenceInClientTypesMap } from "./hasKeyReferenceInClientTypesMap.ts";
import { hasKeyReferenceInValue } from "./hasKeyReferenceinValue.ts";

/**
 * Checks if any of the values have reference to key, and replaces them recursively.
 */
export const getClientTypesMapWithKeysRemovedFromValues = (
  clientTypesMap: Record<string, string>
) => {
  if (!hasKeyReferenceInClientTypesMap(clientTypesMap)) {
    return clientTypesMap;
  }

  const newClientTypeMap = {};
  const keys = Object.keys(clientTypesMap);

  for (const [key, value] of Object.entries(clientTypesMap)) {
    const refs = keys.filter((key) => hasKeyReferenceInValue(key, value));
    if (refs.length === 0) {
      newClientTypeMap[key] = value;
    } else {
      newClientTypeMap[key] = refs.reduce(
        (acc, ref) =>
          acc
            .replace(`Array<${ref}>`, `Array<${clientTypesMap[ref]}>`)
            .replace(`Record<string, ${ref}>`, `Record<string, ${clientTypesMap[ref]}>`),
        value
      );
    }
  }

  return getClientTypesMapWithKeysRemovedFromValues(newClientTypeMap);
};
