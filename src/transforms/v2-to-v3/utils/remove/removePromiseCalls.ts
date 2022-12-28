import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getV2ClientIdentifiers, getV2ClientIdThisExpressions } from "../get";
import { removePromiseForCallExpression } from "./removePromiseForCallExpression";

export interface RemovePromiseCallsOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

// Removes .promise() from client API calls.
export const removePromiseCalls = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: RemovePromiseCallsOptions
): void => {
  const v2ClientIdentifiers = getV2ClientIdentifiers(j, source, options);
  const v2ClientIdThisExpressions = getV2ClientIdThisExpressions(j, source, v2ClientIdentifiers);

  for (const v2ClientId of [...v2ClientIdentifiers, ...v2ClientIdThisExpressions]) {
    // Remove .promise() from client API calls.
    source
      .find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              object: v2ClientId,
            },
          },
          property: { type: "Identifier", name: "promise" },
        },
      })
      .forEach((callExpression) => {
        removePromiseForCallExpression(callExpression);
      });

    // Remove .promise() from client API request stored in a variable.
    source
      .find(j.VariableDeclarator, {
        id: { type: "Identifier" },
        init: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: v2ClientId,
          },
        },
      })
      .forEach((variableDeclarator) => {
        source
          .find(j.CallExpression, {
            callee: {
              type: "MemberExpression",
              object: {
                type: "Identifier",
                name: (variableDeclarator.value.id as Identifier).name,
              },
              property: { type: "Identifier", name: "promise" },
            },
          })
          .forEach((callExpression) => {
            removePromiseForCallExpression(callExpression);
          });
      });
  }
};
