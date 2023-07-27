import { Collection, JSCodeshift, Literal } from "jscodeshift";

import { getClientIdentifiers } from "./getClientIdentifiers";

export interface GetS3SignedUrlApiNameOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const getS3SignedUrlApiNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetS3SignedUrlApiNameOptions
): string[] => {
  if (options.v2ClientName !== "S3") return [];

  const apiNames: Set<string> = new Set();
  const clientIdentifiers = getClientIdentifiers(j, source, options);

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
