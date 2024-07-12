import type { Collection, JSCodeshift } from "jscodeshift";
import { getAwsUtilCallExpression } from "./getAwsUtilCallExpression";

export const replaceAwsUtilCopy = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
) => {
  getAwsUtilCallExpression(j, source, { v2GlobalName, functionName: "copy" })
    .filter(({ node }) => node.arguments.length === 1)
    .replaceWith(({ node }) => {
      const objectAssign = j.memberExpression(j.identifier("Object"), j.identifier("assign"));
      return j.callExpression(objectAssign, [j.objectExpression([]), node.arguments[0]]);
    });
};
