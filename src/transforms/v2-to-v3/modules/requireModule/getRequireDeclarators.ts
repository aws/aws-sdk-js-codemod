import { CallExpression, Collection, JSCodeshift, Literal, VariableDeclarator } from "jscodeshift";
import { PACKAGE_NAME } from "../../config";

const isValidRequireCallExpression = (callExpression: CallExpression, path?: string) => {
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
};

export const getRequireDeclarators = (
  j: JSCodeshift,
  source: Collection<unknown>,
  path?: string
): Collection<VariableDeclarator> =>
  source.find(j.VariableDeclarator).filter((varDeclarator) => {
    const declaratorInit = varDeclarator.value.init;
    if (!declaratorInit) {
      return false;
    }

    switch (declaratorInit.type) {
      case "CallExpression":
        return isValidRequireCallExpression(declaratorInit, path);
      case "MemberExpression": {
        const declaratorInitObject = declaratorInit.object;
        if (declaratorInitObject.type !== "CallExpression") {
          return false;
        }
        return isValidRequireCallExpression(declaratorInitObject, path);
      }
      default:
        return false;
    }
  });
