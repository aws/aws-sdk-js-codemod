import type { Collection, JSCodeshift } from "jscodeshift";

import type { ClientIdentifier } from "../types.ts";
import { getClientApiCallExpression } from "./getClientApiCallExpression.ts";

// Updates `s3.createPresignedPost(params)` API with `await createPresignedPost(s3, params)` API.
export const replaceS3CreatePresignedPostApi = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
): void => {
  for (const clientId of clientIdentifiers) {
    source
      .find(j.CallExpression, getClientApiCallExpression(clientId, "createPresignedPost"))
      .replaceWith((callExpression) =>
        j.awaitExpression.from({
          argument: j.callExpression.from({
            callee: j.identifier("createPresignedPost"),
            arguments: [clientId, callExpression.node.arguments[0]],
          }),
        })
      );
  }
};
