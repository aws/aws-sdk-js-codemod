import { Collection, JSCodeshift } from "jscodeshift";

import { getV3ClientTypeNames } from "../ts-type";
import { getV2ClientNewExpression } from "../utils";
import { addV3ClientDefaultRequire } from "./addV3ClientDefaultRequire";
import { addV3ClientNamedRequire } from "./addV3ClientNamedRequire";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientRequires = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions
): void => {
  const { v2ClientName, v2ClientLocalName, v2GlobalName } = options;
  const v3ClientTypeNames = getV3ClientTypeNames(j, source, { v2ClientName, v2GlobalName });

  // Add default require for types, if needed.
  if (v3ClientTypeNames.length > 0) {
    addV3ClientDefaultRequire(j, source, options);
  }

  const newExpressions = source.find(
    j.NewExpression,
    getV2ClientNewExpression({ v2ClientName, v2ClientLocalName, v2GlobalName })
  );

  if (newExpressions.length) {
    addV3ClientNamedRequire(j, source, options);
  }
};
