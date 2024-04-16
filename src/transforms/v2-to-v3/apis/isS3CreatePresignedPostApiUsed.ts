import { Collection, JSCodeshift } from "jscodeshift";

import { ClientIdentifier } from "../types";

export const isS3CreatePresignedPostApiUsed = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
) => {
  for (const clientId of clientIdentifiers) {
    const s3GetSignedUrlCallExpressions = source.find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: clientId,
        property: { type: "Identifier", name: "createPresignedPost" },
      },
    });
    if (s3GetSignedUrlCallExpressions.length) return true;
  }

  return false;
};
