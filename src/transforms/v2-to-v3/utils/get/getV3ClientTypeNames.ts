import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientTypeNames, GetV2ClientTypeNamesOptions } from "./getV2ClientTypeNames";
import { getV3ClientTypeName } from "./getV3ClientTypeName";

export const getV3ClientTypeNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetV2ClientTypeNamesOptions
) =>
  getV2ClientTypeNames(j, source, options)
    .map((v2ClientTypeName) => getV3ClientTypeName(v2ClientTypeName))
    .filter((v3ClientTypeName) => v3ClientTypeName !== undefined) as string[];
