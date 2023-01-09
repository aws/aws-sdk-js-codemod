import { Collection, JSCodeshift } from "jscodeshift";

export const hasRequire = (j: JSCodeshift, source: Collection<unknown>) =>
  source
    .find(j.CallExpression, {
      callee: { type: "Identifier", name: "require" },
    })
    .filter((callExpression) => {
      const { arguments: args } = callExpression.value;
      return (
        args.length > 0 &&
        (args[0].type === "Literal" || args[0].type === "StringLiteral") &&
        typeof args[0].value === "string" &&
        args[0].value.startsWith("aws-sdk")
      );
    })
    .size() > 0;
