import type { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";

import { DYNAMODB_DOCUMENT_CLIENT } from "../config";
import { getClientNewExpression } from "../utils";

export const getNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] => [
  ...source
    .find(j.NewExpression, getClientNewExpression({ v2GlobalName }))
    .nodes()
    .map(
      (newExpression) => ((newExpression.callee as MemberExpression).property as Identifier).name
    ),
  ...source
    .find(
      j.NewExpression,
      getClientNewExpression({ v2GlobalName, v2ClientName: DYNAMODB_DOCUMENT_CLIENT })
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
