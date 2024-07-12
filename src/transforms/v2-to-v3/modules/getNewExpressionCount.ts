import type { Collection, JSCodeshift } from "jscodeshift";

import { DOCUMENT_CLIENT, DYNAMODB, DYNAMODB_DOCUMENT_CLIENT } from "../config";
import { getClientNewExpression } from "../utils";
import type { ClientModulesOptions } from "./types";

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

  if (v2ClientName === DYNAMODB) {
    newExpressionCount += getNewExpressionCount(j, source, {
      ...options,
      v2ClientName: DYNAMODB_DOCUMENT_CLIENT,
      ...(v2ClientLocalName && {
        v2ClientLocalName: `${v2ClientLocalName}.${DOCUMENT_CLIENT}`,
      }),
    });
  }

  return newExpressionCount;
};
