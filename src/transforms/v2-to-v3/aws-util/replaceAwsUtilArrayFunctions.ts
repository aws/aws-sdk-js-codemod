import type { Collection, FunctionExpression, Identifier, JSCodeshift } from "jscodeshift";
import { getAwsUtilCallExpression } from "./getAwsUtilCallExpression";

export const replaceAwsUtilArrayFunctions = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
) => {
  // replace arrayEach
  getAwsUtilCallExpression(j, source, { v2GlobalName, functionName: "arrayEach" })
    .filter(({ node }) => node.arguments.length === 2)
    .replaceWith(({ node }) => {
      const array = node.arguments[0] as Identifier;
      const iteratee = node.arguments[1] as FunctionExpression;
      return j.callExpression(j.memberExpression(array, j.identifier("forEach")), [iteratee]);
    });

  // replace arraySliceFn
  getAwsUtilCallExpression(j, source, { v2GlobalName, functionName: "arraySliceFn" })
    .filter(({ node }) => node.arguments.length === 1)
    .replaceWith(({ node }) =>
      j.memberExpression(node.arguments[0] as Identifier, j.identifier("slice"))
    );
};
