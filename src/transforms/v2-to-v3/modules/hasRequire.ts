import { Collection, JSCodeshift, Literal } from "jscodeshift";
import { PACKAGE_NAME, STRING_LITERAL_TYPE_LIST } from "../config";

export const hasRequire = (j: JSCodeshift, source: Collection<unknown>) =>
  source
    .find(j.CallExpression, {
      callee: { type: "Identifier", name: "require" },
    })
    .filter((callExpression) => {
      const { arguments: args } = callExpression.value;

      if (args.length === 0) return false;
      if (!STRING_LITERAL_TYPE_LIST.includes(args[0].type)) return false;

      const value = (args[0] as Literal).value;
      return typeof value === "string" && value.startsWith(PACKAGE_NAME);
    })
    .size() > 0;
