import { Collection, JSCodeshift, Literal } from "jscodeshift";
import { PACKAGE_NAME } from "../config";

export const hasRequire = (j: JSCodeshift, source: Collection<unknown>) =>
  source
    .find(j.CallExpression, {
      callee: { type: "Identifier", name: "require" },
    })
    .filter((callExpression) => {
      const { value: sourceValue } = callExpression.value.arguments[0] as Literal;
      return typeof sourceValue === "string" && sourceValue.startsWith(PACKAGE_NAME);
    })
    .size() > 0;
