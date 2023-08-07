import { CallExpression } from "jscodeshift";

import { ClientIdentifier } from "../types";

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
