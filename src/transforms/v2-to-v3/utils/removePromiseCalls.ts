import { CallExpression, Collection, JSCodeshift, MemberExpression } from "jscodeshift";

import { getV2ClientIdNames } from "./getV2ClientIdNames";

export interface RemovePromiseCallsOptions {
  v2ClientName: string;
  v2DefaultModuleName: string;
}

// Removes .promise() from client API calls.
export const removePromiseCalls = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2DefaultModuleName, v2ClientName }: RemovePromiseCallsOptions
): void => {
  const v2ClientIdNames = ["client"];
  // const v2ClientIdNames = getV2ClientIdNames(j, source, {
  //   v2DefaultModuleName,
  //   v2ClientName,
  // });

  for (const v2ClientIdName of v2ClientIdNames) {
    source
      .find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              object: {
                type: "MemberExpression",
                object: {
                  type: "ThisExpression",
                },
                property: {
                  type: "Identifier",
                  name: v2ClientIdName,
                },
              },
            },
          },
          property: { type: "Identifier", name: "promise" },
        },
      })
      .forEach((callExpressionPath) => {
        switch (callExpressionPath.parentPath.value.type) {
          case "AwaitExpression":
            callExpressionPath.parentPath.value.argument = (
              callExpressionPath.value.callee as MemberExpression
            ).object;
            break;
          case "MemberExpression":
            callExpressionPath.parentPath.value.object = (
              callExpressionPath.value.callee as MemberExpression
            ).object;
            break;
          case "VariableDeclarator":
            callExpressionPath.parentPath.value.init = (
              callExpressionPath.value.callee as MemberExpression
            ).object;
            break;
          case "ArrowFunctionExpression":
          case "ReturnStatement":
            callExpressionPath.value.callee = (
              (callExpressionPath.value.callee as MemberExpression).object as CallExpression
            ).callee;
            break;
          default:
            throw new Error(
              `Removal of .promise() not implemented for ${callExpressionPath.parentPath.value.type}`
            );
        }
      });
  }
};
