import { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";

import { getV2ClientNewExpressionFilter } from "../utils";

export const getV2ClientNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] =>
  source
    .find(j.NewExpression, getV2ClientNewExpressionFilter({ v2GlobalName }))
    .nodes()
    .map(
      (newExpression) => ((newExpression.callee as MemberExpression).property as Identifier).name
    );
