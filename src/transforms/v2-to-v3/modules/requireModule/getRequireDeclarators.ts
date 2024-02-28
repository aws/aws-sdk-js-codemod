import { CallExpression, Collection, JSCodeshift, Literal, VariableDeclarator } from "jscodeshift";
import { PACKAGE_NAME } from "../../config";

export const getRequireDeclarators = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
): Collection<VariableDeclarator> =>
  source
    .find(j.VariableDeclarator, {
      init: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "require" },
      },
    })
    .filter((varDeclarator) => {
      const declaratorInit = varDeclarator.value.init;
      if (!declaratorInit || declaratorInit.type !== "CallExpression") {
        return false;
      }

      const callExpression = declaratorInit as CallExpression;
      if (callExpression.arguments.length !== 1) {
        return false;
      }

      const { value: sourceValue } = callExpression.arguments[0] as Literal;
      if (typeof sourceValue !== "string") {
        return false;
      }

      if (path) {
        return sourceValue === path;
      }

      return sourceValue.startsWith(PACKAGE_NAME);
    });
