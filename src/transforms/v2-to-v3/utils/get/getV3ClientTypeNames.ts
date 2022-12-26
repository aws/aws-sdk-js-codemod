import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientTypes, GetV2ClientTypesOptions } from "./getV2ClientTypes";
import { getV3ClientTypeName } from "./getV3ClientTypeName";

export const getV3ClientTypeNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetV2ClientTypesOptions
) =>
  getV2ClientTypes(j, source, options)
    .map((v2ClientType) => getV3ClientTypeName(v2ClientType))
    .filter((v3ClientType) => v3ClientType !== undefined) as string[];
