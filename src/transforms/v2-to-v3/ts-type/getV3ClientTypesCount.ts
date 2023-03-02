import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_TYPES_MAP } from "../config";
import { getClientTypeNames, GetClientTypeNamesOptions } from "./getClientTypeNames";

const arrayBracketRegex = /<([\w]+)>/g;
const recordBracketRegex = /<string, ([\w]+)>/g;
const nativeTypes = ["string", "number", "boolean", "Date", "Uint8Array"];

const getTypesFromString = (str: string): string[] => {
  const arraryMatches = [...str.matchAll(arrayBracketRegex)].map((match) => match[1]);
  const recordMatches = [...str.matchAll(recordBracketRegex)].map((match) => match[1]);

  return [...arraryMatches, ...recordMatches];
};

export const getV3ClientTypesCount = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetClientTypeNamesOptions
) => {
  const { v2ClientName } = options;

  const clientTypeNames = getClientTypeNames(j, source, options);
  const clientTypesMap = CLIENT_TYPES_MAP[v2ClientName];
  const v3ClientUnavailableTypes = Object.keys(clientTypesMap);

  return clientTypeNames.filter((clientTypeName) => {
    if (!v3ClientUnavailableTypes.includes(clientTypeName)) {
      return true;
    }
    const typesFromString = getTypesFromString(clientTypesMap[clientTypeName]);
    return typesFromString.some((type) => !nativeTypes.includes(type));
  }).length;
};
