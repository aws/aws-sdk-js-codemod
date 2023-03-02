import { CallExpression } from "jscodeshift";

import { ClientIdentifier } from "./getClientIdentifiers";

export const getV2ClientS3UploadCallExpression = (
  v2ClientId: ClientIdentifier
  // @ts-expect-error Property 'arguments' is missing in type
): CallExpression => ({
  type: "CallExpression",
  callee: {
    type: "MemberExpression",
    object: v2ClientId,
    property: { type: "Identifier", name: "upload" },
  },
});
