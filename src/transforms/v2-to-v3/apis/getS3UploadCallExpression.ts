import { CallExpression } from "jscodeshift";

import { ClientIdentifier } from "./getClientIdentifiers";

// @ts-expect-error Property 'arguments' is missing in type
export const getS3UploadCallExpression = (clientId: ClientIdentifier): CallExpression => ({
  type: "CallExpression",
  callee: {
    type: "MemberExpression",
    object: clientId,
    property: { type: "Identifier", name: "upload" },
  },
});
