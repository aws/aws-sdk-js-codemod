import { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";

import { getClientNewExpression } from "../utils";

export const getNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] =>
  source
    .find(j.NewExpression, getClientNewExpression({ v2GlobalName }))
    .nodes()
    .map(
      (newExpression) => ((newExpression.callee as MemberExpression).property as Identifier).name
    );
