import { Collection, JSCodeshift } from "jscodeshift";

export const hasRequire = (j: JSCodeshift, source: Collection<unknown>) =>
  source
    .find(j.CallExpression, {
      callee: { type: "Identifier", name: "require" },
    })
    .size() > 0;
