import { hasKeyReferenceInValue } from "./hasKeyReferenceinValue.ts";

/**
 * Checks if any of the values in the clientTypesMap has a reference to any of the keys.
 */
export const hasKeyReferenceInClientTypesMap = (clientTypesMap: Record<string, string>) => {
  const keys = Object.keys(clientTypesMap);
  for (const value of Object.values(clientTypesMap)) {
    if (keys.some((key) => hasKeyReferenceInValue(key, value))) {
      // console.log({ keys, value });
      return true;
    }
  }
  return false;
};
