import type { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_REQ_RESP_TYPES_MAP, CLIENT_TYPES_MAP } from "../config";
import { type GetClientTypeNamesOptions, getClientTypeNames } from "./getClientTypeNames";

const arrayBracketRegex = /<([\w]+)>/g;
const recordBracketRegex = /<string, ([\w]+)>/g;
const nativeTypes = ["string", "number", "boolean", "Date", "Uint8Array"];

const getTypesFromString = (str: string): string[] => {
  const arraryMatches = [...str.matchAll(arrayBracketRegex)].map((match) => match[1]);
  const recordMatches = [...str.matchAll(recordBracketRegex)].map((match) => match[1]);

  return [...arraryMatches, ...recordMatches].sort();
};

export const getV3ClientTypes = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetClientTypeNamesOptions
) => {
  const { v2ClientName } = options;

  const clientTypeNames = getClientTypeNames(j, source, options);

  const clientTypesMap = CLIENT_TYPES_MAP[v2ClientName];
  const v3ClientUnavailableTypes = Object.keys(clientTypesMap).filter(
    (item) => item !== "ClientConfiguration"
  );
  const clientReqRespTypesMap = CLIENT_REQ_RESP_TYPES_MAP[v2ClientName];

  return clientTypeNames
    .filter((clientTypeName) => {
      if (!v3ClientUnavailableTypes.includes(clientTypeName)) {
        return true;
      }
      const typesFromString = getTypesFromString(clientTypesMap[clientTypeName]);
      return typesFromString.some((type) => !nativeTypes.includes(type));
    })
    .flatMap((clientTypeName) => {
      if (clientTypeName === "ClientConfiguration") {
        return clientTypesMap[clientTypeName];
      }

      if (Object.keys(clientReqRespTypesMap).includes(clientTypeName)) {
        return clientReqRespTypesMap[clientTypeName];
      }

      if (Object.keys(clientTypesMap).includes(clientTypeName)) {
        return getTypesFromString(clientTypesMap[clientTypeName]);
      }

      return clientTypeName;
    });
};
