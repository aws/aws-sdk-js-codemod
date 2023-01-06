import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_TYPES_MAP } from "../config";
import { getV2ClientTypeNames, GetV2ClientTypeNamesOptions } from "./getV2ClientTypeNames";

export const getV3ClientTypesCount = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetV2ClientTypeNamesOptions
) => {
  const { v2ClientName } = options;

  const v2ClientTypeNames = getV2ClientTypeNames(j, source, options);
  const v3ClientUnavailableTypes = Object.keys(CLIENT_TYPES_MAP[v2ClientName]);

  return v2ClientTypeNames.filter(
    (v2ClientTypeName) => !v3ClientUnavailableTypes.includes(v2ClientTypeName)
  ).length;
};
