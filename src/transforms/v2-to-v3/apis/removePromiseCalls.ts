import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { ClientIdentifier } from "../types";
import { removePromiseForCallExpression } from "./removePromiseForCallExpression";

// Removes .promise() from client API calls.
export const removePromiseCalls = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
): void => {
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
