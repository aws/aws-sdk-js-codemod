import type { Collection, Identifier, JSCodeshift } from "jscodeshift";

import type { ClientIdentifier } from "../types.ts";
import { removePromiseForCallExpression } from "./removePromiseForCallExpression.ts";

export interface RemovePromiseCallsOptions {
  v2GlobalName?: string;
  v2ClientName: string;
  v2ClientLocalName: string;
  clientIdentifiers: ClientIdentifier[];
}

// Removes .promise() from client API calls.
export const removePromiseCalls = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, v2ClientName, v2ClientLocalName, clientIdentifiers }: RemovePromiseCallsOptions
): void => {
  // Remove .promise() for API calls from client creation from global name.
  if (v2GlobalName) {
    source
      .find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              object: {
                type: "NewExpression",
                callee: {
                  type: "MemberExpression",
                  object: { type: "Identifier", name: v2GlobalName },
                  property: { type: "Identifier", name: v2ClientName },
                },
              },
            },
          },
          property: { type: "Identifier", name: "promise" },
        },
      })
      .forEach((callExpression) => {
        removePromiseForCallExpression(j, callExpression);
      });
  }

  // Remove .promise() for API calls client creation from local name.
  source
    .find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: {
              type: "NewExpression",
              callee: { type: "Identifier", name: v2ClientLocalName },
            },
          },
        },
        property: { type: "Identifier", name: "promise" },
      },
    })
    .forEach((callExpression) => {
      removePromiseForCallExpression(j, callExpression);
    });

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
