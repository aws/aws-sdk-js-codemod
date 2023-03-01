import { CallExpression } from "jscodeshift";

import { V2ClientIdentifier } from "./getV2ClientIdentifiers";

export const getV2ClientWaiterCallExpression = (
  v2ClientId: V2ClientIdentifier,
  waiterState: string
): CallExpression => ({
  type: "CallExpression",
  callee: {
    type: "MemberExpression",
    object: v2ClientId,
    property: { type: "Identifier", name: "waitFor" },
  },
  // @ts-expect-error Type 'string' is not assignable to type 'RegExp'
  arguments: [{ value: waiterState }],
});