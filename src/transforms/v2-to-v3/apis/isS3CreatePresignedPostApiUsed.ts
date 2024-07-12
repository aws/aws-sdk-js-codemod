import type { Collection, JSCodeshift } from "jscodeshift";

import type { ClientIdentifier } from "../types";

export const isS3CreatePresignedPostApiUsed = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
) => {
  for (const clientId of clientIdentifiers) {
    if (
      source.find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: clientId,
          property: { type: "Identifier", name: "createPresignedPost" },
        },
      }).length
    )
      return true;
  }

  return false;
};
