import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientNewExpression } from "../utils";
import { V3ClientModulesOptions } from "./types";

export const getNewExpressionCount = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: V3ClientModulesOptions
): number => {
  let newExpressionCount = 0;

  if (v2GlobalName) {
    const newExpressionsFromGlobalName = source.find(
      j.NewExpression,
      getV2ClientNewExpression({ v2ClientName, v2GlobalName })
    );
    newExpressionCount += newExpressionsFromGlobalName.length;
  }

  const newExpressionsFromClientLocalName = source.find(
    j.NewExpression,
    getV2ClientNewExpression({ v2ClientLocalName })
  );
  newExpressionCount += newExpressionsFromClientLocalName.length;

  return newExpressionCount;
};
