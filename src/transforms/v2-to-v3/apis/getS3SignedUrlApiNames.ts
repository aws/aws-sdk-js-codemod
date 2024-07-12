import type { Collection, JSCodeshift, Literal } from "jscodeshift";

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
          apiNames.add((callExpression.value.arguments[0] as Literal).value as string);
        });
    }
  }

  return [...apiNames].sort();
};
