import { Collection, JSCodeshift } from "jscodeshift";

import { DYNAMODB } from "../config";
import { getDocClientNewExpression } from "../utils";
import { ClientModulesOptions } from "./types";

export const getDocClientNewExpressionCount = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: ClientModulesOptions
): number => {
  if (v2ClientName !== DYNAMODB) {
    return 0;
  }

  let newExpressionCount = 0;

  if (v2GlobalName) {
    const newExpressionsFromGlobalNameDocClient = source.find(
      j.NewExpression,
      getDocClientNewExpression({ v2GlobalName })
    );
    newExpressionCount += newExpressionsFromGlobalNameDocClient.length;
  }

  const newExpressionsFromClientLocalNameDocClient = source.find(
    j.NewExpression,
    getDocClientNewExpression({ v2ClientLocalName })
  );
  newExpressionCount += newExpressionsFromClientLocalNameDocClient.length;

  return newExpressionCount;
};
