import { Collection, JSCodeshift, TryStatement } from "jscodeshift";

import { ClientIdentifier } from "../types";

// Renames error.code with error.name.
export const renameErrorCodeWithName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
): void => {
  for (const clientId of clientIdentifiers) {
    // Replace error.code with error.name in catch clauses.
    source
      .find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: clientId,
        },
      })
      .forEach((callExpression) => {
        const tryStatement = j(callExpression).closest(j.TryStatement).nodes()[0] as TryStatement;

        if (!tryStatement || !tryStatement.handler) {
          return;
        }

        const catchClause = tryStatement.handler;
        const errorParam = catchClause.param;

        if (errorParam?.type !== "Identifier") {
          return;
        }

        j(catchClause.body)
          .find(j.MemberExpression, {
            object: {
              type: "Identifier",
              name: errorParam.name,
            },
            property: {
              type: "Identifier",
              name: "code",
            },
          })
          .replaceWith(() => j.memberExpression(errorParam, j.identifier("name")));
      });
  }
};
