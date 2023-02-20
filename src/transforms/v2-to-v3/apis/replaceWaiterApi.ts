import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientIdentifiers } from "./getV2ClientIdentifiers";
import { getV2ClientIdThisExpressions } from "./getV2ClientIdThisExpressions";

export interface ReplaceWaiterApiOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

// Updates .waitFor() API with waitUntil* API.
export const replaceWaiterApi = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ReplaceWaiterApiOptions
): void => {
  const v2ClientIdentifiers = getV2ClientIdentifiers(j, source, options);
  const v2ClientIdThisExpressions = getV2ClientIdThisExpressions(j, source, v2ClientIdentifiers);

  for (const v2ClientId of [...v2ClientIdentifiers, ...v2ClientIdThisExpressions]) {
    // Replace .waitFor() in client API calls.
    // source
    //   .find(j.CallExpression, {
    //     callee: {
    //       type: "MemberExpression",
    //       object: {
    //         type: "CallExpression",
    //         callee: {
    //           type: "MemberExpression",
    //           object: v2ClientId,
    //         },
    //       },
    //       property: { type: "Identifier", name: "promise" },
    //     },
    //   })
    //   // Use replaceWith() instead of forEach() to replace the node.
    //   .forEach((callExpression) => {
    //     removePromiseForCallExpression(callExpression);
    //   });
    // Replace .waitFor() from client API request stored in a variable.
    // source
    //   .find(j.VariableDeclarator, {
    //     id: { type: "Identifier" },
    //     init: {
    //       type: "CallExpression",
    //       callee: {
    //         type: "MemberExpression",
    //         object: v2ClientId,
    //       },
    //     },
    //   })
    //   .forEach((variableDeclarator) => {
    //     source
    //       .find(j.CallExpression, {
    //         callee: {
    //           type: "MemberExpression",
    //           object: {
    //             type: "Identifier",
    //             name: (variableDeclarator.value.id as Identifier).name,
    //           },
    //           property: { type: "Identifier", name: "promise" },
    //         },
    //       })
    //       .forEach((callExpression) => {
    //         removePromiseForCallExpression(callExpression);
    //       });
    //   });
  }
};
