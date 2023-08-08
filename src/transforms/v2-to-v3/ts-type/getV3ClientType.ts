import { JSCodeshift, TSType } from "jscodeshift";

import {
  CLIENT_TYPES_MAP,
  V2_CLIENT_INPUT_SUFFIX_LIST,
  V2_CLIENT_OUTPUT_SUFFIX_LIST,
} from "../config";
import { getDefaultLocalName } from "../utils";
import { getTypeForString } from "./getTypeForString";

export interface GetV3ClientTypeOptions {
  v2ClientLocalName: string;
  v2ClientName: string;
  v2ClientTypeName: string;
}

const getTypeRefWithV3ClientDefaultLocalName = (
  j: JSCodeshift,
  v3ClientDefaultLocalName: string,
  v3ClientTypeName: string
) => j.tsTypeReference(j.identifier([v3ClientDefaultLocalName, v3ClientTypeName].join(".")));

export const getV3ClientType = (
  j: JSCodeshift,
  { v2ClientLocalName, v2ClientName, v2ClientTypeName }: GetV3ClientTypeOptions
): TSType => {
  const clientTypesMap = CLIENT_TYPES_MAP[v2ClientName];
  const defaultLocalName = getDefaultLocalName(v2ClientLocalName);

  if (Object.keys(clientTypesMap).includes(v2ClientTypeName)) {
    return getTypeForString(j, defaultLocalName, clientTypesMap[v2ClientTypeName]);
  }

  for (const inputSuffix of V2_CLIENT_INPUT_SUFFIX_LIST) {
    if (v2ClientTypeName.endsWith(inputSuffix)) {
      return getTypeRefWithV3ClientDefaultLocalName(
        j,
        defaultLocalName,
        v2ClientTypeName.replace(new RegExp(`${inputSuffix}$`), "CommandInput")
      );
    }
  }

  for (const outputSuffix of V2_CLIENT_OUTPUT_SUFFIX_LIST) {
    if (v2ClientTypeName.endsWith(outputSuffix)) {
      return getTypeRefWithV3ClientDefaultLocalName(
        j,
        defaultLocalName,
        v2ClientTypeName.replace(new RegExp(`${outputSuffix}$`), "CommandOutput")
      );
    }
  }

  return getTypeRefWithV3ClientDefaultLocalName(j, defaultLocalName, v2ClientTypeName);
};
