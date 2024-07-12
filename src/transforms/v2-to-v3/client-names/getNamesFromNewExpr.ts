import type { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";

import { DYNAMODB_DOCUMENT_CLIENT } from "../config";
import { getClientNewExpressionFromGlobalName } from "../utils";

export const getNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] => [
  ...source
    .find(j.NewExpression, getClientNewExpressionFromGlobalName(v2GlobalName))
    .nodes()
    .map(
      (newExpression) => ((newExpression.callee as MemberExpression).property as Identifier).name
    ),
  ...source
    .find(
      j.NewExpression,
      getClientNewExpressionFromGlobalName(v2GlobalName, DYNAMODB_DOCUMENT_CLIENT)
    )
    .nodes()
    .map(
      (newExpression) =>
        (
          ((newExpression.callee as MemberExpression).object as MemberExpression)
            .property as Identifier
        ).name
    ),
];
