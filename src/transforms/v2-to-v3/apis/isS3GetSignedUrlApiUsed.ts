import { Collection, JSCodeshift } from "jscodeshift";

import { getClientIdentifiers } from "./getClientIdentifiers";

export interface IsS3GetSignedUrlApiUsedOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const isS3GetSignedUrlApiUsed = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: IsS3GetSignedUrlApiUsedOptions
) => {
  if (options.v2ClientName !== "S3") return false;

  const clientIdentifiers = getClientIdentifiers(j, source, options);

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
