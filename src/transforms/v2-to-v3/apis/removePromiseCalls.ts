import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getClientIdentifiers } from "./getClientIdentifiers";
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
  const clientIdentifiers = getClientIdentifiers(j, source, options);

  for (const clientId of clientIdentifiers) {
    // Remove .promise() from client API calls.
    source
      .find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              object: clientId,
            },
          },
          property: { type: "Identifier", name: "promise" },
        },
      })
      .forEach((callExpression) => {
        removePromiseForCallExpression(j, callExpression);
      });

    // Remove .promise() from client API request stored in a variable.
    source
      .find(j.VariableDeclarator, {
        id: { type: "Identifier" },
        init: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: clientId,
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
            removePromiseForCallExpression(j, callExpression);
          });
      });
  }
};
