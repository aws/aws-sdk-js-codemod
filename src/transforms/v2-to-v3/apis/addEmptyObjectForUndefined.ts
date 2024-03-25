import { Collection, JSCodeshift } from "jscodeshift";

import { ClientIdentifier } from "../types";

// Adds an empty object, if undefined is passed for optional parameters.
export const addEmptyObjectForUndefined = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
): void => {
  for (const clientId of clientIdentifiers) {
    source
      .find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: clientId,
        },
      })
      .filter((callExpression) => {
        return (
          callExpression.value.arguments.length === 1 &&
          ["FunctionExpression", "ArrowFunctionExpression"].includes(
            callExpression.value.arguments[0].type
          )
        );
      })
      .replaceWith((callExpression) => {
        callExpression.value.arguments.unshift(j.objectExpression([]));
        return callExpression.value;
      });
  }
};
