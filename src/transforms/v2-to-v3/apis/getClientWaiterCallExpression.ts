import { CallExpression } from "jscodeshift";

import { ClientIdentifier } from "../types";

export const getClientWaiterCallExpression = (
  clientId: ClientIdentifier,
  waiterState: string
): CallExpression => ({
  type: "CallExpression",
  callee: {
    type: "MemberExpression",
    object: clientId,
    property: { type: "Identifier", name: "waitFor" },
  },
  // @ts-expect-error Type 'string' is not assignable to type 'RegExp'
  arguments: [{ value: waiterState }],
});
