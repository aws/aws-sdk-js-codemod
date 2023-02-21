import { Collection, JSCodeshift } from "jscodeshift";

import { getClientWaiterStates } from "./getClientWaiterStates";
import { getV2ClientIdentifiers } from "./getV2ClientIdentifiers";
import { getV3ClientWaiterApiName } from "./getV3ClientWaiterApiName";

export interface ReplaceWaiterApiOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

// Updates .waitFor() API with waitUntil* API.
export const replaceWaiterApi = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ReplaceWaiterApiOptions
): void => {
  const v2ClientIdentifiers = getV2ClientIdentifiers(j, source, options);

  for (const v2ClientId of v2ClientIdentifiers) {
    const waiterStates = getClientWaiterStates(j, source, options);

    for (const waiterState of waiterStates) {
      const v3WaiterApiName = getV3ClientWaiterApiName(waiterState);
      source
        .find(j.CallExpression, {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: v2ClientId,
            property: { type: "Identifier", name: "waitFor" },
          },
        })
        .replaceWith((callExpression) => {
          return j.callExpression(j.identifier(v3WaiterApiName), [
            j.objectExpression([
              j.objectProperty.from({
                key: j.identifier("client"),
                value: v2ClientId,
                shorthand: true,
              }),
              // ToDo: Read maxWaitTime from the waiter configuration
              j.objectProperty.from({
                key: j.identifier("maxWaitTime"),
                value: j.numericLiteral(180),
              }),
            ]),
            callExpression.node.arguments[1],
          ]);
        });
    }
  }
};
