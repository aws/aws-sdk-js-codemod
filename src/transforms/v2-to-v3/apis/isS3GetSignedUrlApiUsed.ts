import { Collection, JSCodeshift } from "jscodeshift";

import { ClientIdentifier } from "../types";

export const isS3GetSignedUrlApiUsed = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
) => {
  for (const clientId of clientIdentifiers) {
    for (const apiName of ["getSignedUrl", "getSignedUrlPromise"]) {
      const s3GetSignedUrlCallExpressions = source.find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: clientId,
          property: { type: "Identifier", name: apiName },
        },
      });
      if (s3GetSignedUrlCallExpressions.length) return true;
    }
  }

  return false;
};
