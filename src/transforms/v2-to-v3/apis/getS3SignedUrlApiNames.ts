import type { Collection, JSCodeshift } from "jscodeshift";

import type { ClientIdentifier } from "../types";

export const getS3SignedUrlApiNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
): string[] => {
  const apiNames: Set<string> = new Set();

  for (const clientId of clientIdentifiers) {
    for (const apiName of ["getSignedUrl", "getSignedUrlPromise"]) {
      source
        .find(j.CallExpression, {
          callee: {
            type: "MemberExpression",
            object: clientId,
            property: { type: "Identifier", name: apiName },
          },
        })
        .forEach((callExpression) => {
          const callExpressionArg = callExpression.value.arguments[0];
          if (callExpressionArg.type !== "Literal" && callExpressionArg.type !== "StringLiteral") {
            return;
          }
          if (typeof callExpressionArg.value !== "string") {
            return;
          }
          apiNames.add(callExpressionArg.value);
        });
    }
  }

  return [...apiNames].sort();
};
