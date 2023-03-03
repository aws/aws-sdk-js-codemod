import { Collection, JSCodeshift } from "jscodeshift";

import { getClientNewExpression } from "../utils";
import { getDocClientNewExpressionCount } from "./getDocClientNewExpressionCount";
import { ClientModulesOptions } from "./types";

export const getNewExpressionCount = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions
): number => {
  const { v2ClientName, v2ClientLocalName, v2GlobalName } = options;
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

  newExpressionCount += getDocClientNewExpressionCount(j, source, options);

  return newExpressionCount;
};
