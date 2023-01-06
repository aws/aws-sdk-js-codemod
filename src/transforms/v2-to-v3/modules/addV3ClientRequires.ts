import { Collection, JSCodeshift } from "jscodeshift";

import { getV3ClientTypesCount } from "../ts-type";
import { addV3ClientDefaultRequire } from "./addV3ClientDefaultRequire";
import { addV3ClientNamedRequire } from "./addV3ClientNamedRequire";
import { getClientTSTypeRefCount } from "./getClientTSTypeRefCount";
import { getNewExpressionCount } from "./getNewExpressionCount";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientRequires = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions
): void => {
  const { v2ClientLocalName, v2ClientName, v2GlobalName } = options;
  const v3ClientTypesCount = getV3ClientTypesCount(j, source, {
    v2ClientLocalName,
    v2ClientName,
    v2GlobalName,
  });

  // Add default require for types, if needed.
  if (v3ClientTypesCount > 0) {
    addV3ClientDefaultRequire(j, source, options);
  }

  if (
    getNewExpressionCount(j, source, options) > 0 ||
    getClientTSTypeRefCount(j, source, options) > 0
  ) {
    addV3ClientNamedRequire(j, source, options);
  }
};
