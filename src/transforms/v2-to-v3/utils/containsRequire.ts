import { Collection, JSCodeshift } from "jscodeshift";

export const containsRequire = (j: JSCodeshift, source: Collection<unknown>) =>
  source
    .find(j.CallExpression, {
      callee: { type: "Identifier", name: "require" },
    })
    .size() > 0;
