import { Collection, JSCodeshift } from "jscodeshift";

import { getClientNewExpression } from "../utils";
import { ClientModulesOptions } from "./types";

export const getNewExpressionCount = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: ClientModulesOptions
): number => {
  let newExpressionCount = 0;

  if (v2GlobalName) {
    const newExpressionsFromGlobalName = source.find(
      j.NewExpression,
      getClientNewExpression({ v2ClientName, v2GlobalName })
    );
    newExpressionCount += newExpressionsFromGlobalName.length;
  }

  const newExpressionsFromClientLocalName = source.find(
    j.NewExpression,
    getClientNewExpression({ v2ClientLocalName })
  );
  newExpressionCount += newExpressionsFromClientLocalName.length;

  return newExpressionCount;
};
