import { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";

import { getV2ClientNewExpression } from "../get";

export const getV2ClientNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2DefaultModuleName: string
): string[] =>
  source
    .find(j.NewExpression, getV2ClientNewExpression({ v2DefaultModuleName }))
    .nodes()
    .map(
      (newExpression) => ((newExpression.callee as MemberExpression).property as Identifier).name
    );
