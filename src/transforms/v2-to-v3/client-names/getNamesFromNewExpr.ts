import { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";

import { getNewExpressionVariants } from "../apis";
import { DYNAMODB_DOCUMENT_CLIENT } from "../config";
import { getClientNewExpression } from "../utils";

export const getNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] => [
  ...getNewExpressionVariants(getClientNewExpression({ v2GlobalName }))
    .map((newExpressionVariant) =>
      source
        .find(j.NewExpression, newExpressionVariant)
        .nodes()
        .map(
          (newExpression) =>
            ((newExpression.callee as MemberExpression).property as Identifier).name
        )
    )
    .flat(),
  ...getNewExpressionVariants(
    getClientNewExpression({ v2GlobalName, v2ClientName: DYNAMODB_DOCUMENT_CLIENT })
  )
    .map((newExpressionVariant) =>
      source
        .find(j.NewExpression, newExpressionVariant)
        .nodes()
        .map(
          (newExpression) =>
            (
              ((newExpression.callee as MemberExpression).object as MemberExpression)
                .property as Identifier
            ).name
        )
    )
    .flat(),
];
