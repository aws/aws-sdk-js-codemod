import type { CallExpression } from "jscodeshift";

import type { ClientIdentifier } from "../types.ts";

export const getClientApiCallExpression = (
  clientId: ClientIdentifier,
  apiName: string
  // @ts-expect-error Property 'arguments' is missing in type
): CallExpression => ({
  type: "CallExpression",
  callee: {
    type: "MemberExpression",
    object: clientId,
    property: { type: "Identifier", name: apiName },
  },
});
