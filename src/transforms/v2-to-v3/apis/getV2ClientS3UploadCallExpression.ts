import { CallExpression } from "jscodeshift";

import { V2ClientIdentifier } from "./getV2ClientIdentifiers";

export const getV2ClientS3UploadCallExpression = (
  v2ClientId: V2ClientIdentifier
  // @ts-expect-error Property 'arguments' is missing in type
): CallExpression => ({
  type: "CallExpression",
  callee: {
    type: "MemberExpression",
    object: v2ClientId,
    property: { type: "Identifier", name: "upload" },
  },
});
