import { JSCodeshift, TSTypeReference } from "jscodeshift";

import {
  CLIENT_TYPES_MAP,
  V2_CLIENT_INPUT_SUFFIX_LIST,
  V2_CLIENT_OUTPUT_SUFFIX_LIST,
} from "../config";
import { getV3ClientDefaultLocalName } from "../utils";

export interface GetV3ClientTypeReferenceOptions {
  v2ClientLocalName: string;
  v2ClientName: string;
  v2ClientTypeName: string;
}

const getTypeRefWithV3ClientDefaultLocalName = (
  j: JSCodeshift,
  v2ClientLocalName: string,
  v3ClientTypeName: string
) =>
  j.tsTypeReference(
    j.identifier([getV3ClientDefaultLocalName(v2ClientLocalName), v3ClientTypeName].join("."))
  );

export const getV3ClientTypeReference = (
  j: JSCodeshift,
  { v2ClientLocalName, v2ClientName, v2ClientTypeName }: GetV3ClientTypeReferenceOptions
): TSTypeReference => {
  const clientTypesMap = CLIENT_TYPES_MAP[v2ClientName];
  if (Object.keys(clientTypesMap).includes(v2ClientTypeName)) {
    // ToDo: Convert the string value into a TSTypeReference
    return clientTypesMap[v2ClientTypeName];
  }

  for (const inputSuffix of V2_CLIENT_INPUT_SUFFIX_LIST) {
    if (v2ClientTypeName.endsWith(inputSuffix)) {
      return getTypeRefWithV3ClientDefaultLocalName(
        j,
        v2ClientLocalName,
        v2ClientTypeName.replace(new RegExp(`${inputSuffix}$`), "CommandInput")
      );
    }
  }

  for (const outputSuffix of V2_CLIENT_OUTPUT_SUFFIX_LIST) {
    if (v2ClientTypeName.endsWith(outputSuffix)) {
      return getTypeRefWithV3ClientDefaultLocalName(
        j,
        v2ClientLocalName,
        v2ClientTypeName.replace(new RegExp(`${outputSuffix}$`), "CommandOutput")
      );
    }
  }

  return getTypeRefWithV3ClientDefaultLocalName(j, v2ClientLocalName, v2ClientTypeName);
};
