import { Collection, JSCodeshift } from "jscodeshift";

import { getClientWaiterStates } from "./getClientWaiterStates";
import { getV2ClientIdentifiers } from "./getV2ClientIdentifiers";
import { getV3ClientWaiterApiName } from "./getV3ClientWaiterApiName";
import { getWaiterConfiguration } from "./getWaiterConfiguration";
import { getWaiterConfigurationValue } from "./getWaiterConfigurationValue";

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
          arguments: [{ value: waiterState }],
        })
        .replaceWith((callExpression) => {
          const waiterConfiguration = getWaiterConfiguration(callExpression.node.arguments[1]);
          const delay = getWaiterConfigurationValue(waiterConfiguration, "delay");

          const properties = [];
          properties.push(
            j.objectProperty.from({
              key: j.identifier("client"),
              value: v2ClientId,
              shorthand: true,
            })
          );

          if (delay) {
            properties.push(
              j.objectProperty.from({
                key: j.identifier("minDelay"),
                value: j.numericLiteral(Number(delay)),
              })
            );
          }

          properties.push(
            j.objectProperty.from({
              key: j.identifier("maxWaitTime"),
              value: j.numericLiteral(180),
            })
          );

          return j.callExpression(j.identifier(v3WaiterApiName), [
            j.objectExpression(properties),
            callExpression.node.arguments[1],
          ]);
        });
    }
  }
};
