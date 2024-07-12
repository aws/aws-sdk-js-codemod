import type { Collection, JSCodeshift } from "jscodeshift";

import type { ClientIdentifier } from "../types";

export const isS3UploadApiUsed = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
) => {
  for (const clientId of clientIdentifiers) {
    const s3UploadCallExpressions = source.find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: clientId,
        property: { type: "Identifier", name: "upload" },
      },
    });

    if (s3UploadCallExpressions.length) return true;
  }

  return false;
};
