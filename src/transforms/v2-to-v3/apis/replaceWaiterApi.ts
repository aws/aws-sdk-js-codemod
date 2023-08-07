import { Collection, JSCodeshift } from "jscodeshift";

import { getArgsWithoutWaiterConfig } from "./getArgsWithoutWaiterConfig";
import { getClientIdentifiers } from "./getClientIdentifiers";
import { getClientWaiterCallExpression } from "./getClientWaiterCallExpression";
import { getClientWaiterStates } from "./getClientWaiterStates";
import { getV3ClientWaiterApiName } from "./getV3ClientWaiterApiName";
import { getWaiterConfig } from "./getWaiterConfig";
import { getWaiterConfigValue } from "./getWaiterConfigValue";

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
  const clientIdentifiers = getClientIdentifiers(j, source, options);

  for (const clientId of clientIdentifiers) {
    const waiterStates = getClientWaiterStates(j, source, clientIdentifiers);

    for (const waiterState of waiterStates) {
      const v3WaiterApiName = getV3ClientWaiterApiName(waiterState);
      source
        .find(j.CallExpression, getClientWaiterCallExpression(clientId, waiterState))
        .replaceWith((callExpression) => {
          const waiterConfig = getWaiterConfig(callExpression.node.arguments[1]);
          const delay = getWaiterConfigValue(waiterConfig, "delay");
          const maxAttempts = getWaiterConfigValue(waiterConfig, "maxAttempts");

          const properties = [];
          properties.push(
            j.objectProperty.from({
              key: j.identifier("client"),
              value: clientId,
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

          const delayForWaitTime = delay ? Number(delay) : 10;
          const maxAttemptsForWaitTime = maxAttempts ? Number(maxAttempts) : 10;
          const maxWaitTime = 2 * delayForWaitTime * maxAttemptsForWaitTime;

          properties.push(
            j.objectProperty.from({
              key: j.identifier("maxWaitTime"),
              value: j.numericLiteral(maxWaitTime),
            })
          );

          return j.callExpression(j.identifier(v3WaiterApiName), [
            j.objectExpression(properties),
            getArgsWithoutWaiterConfig(callExpression.node.arguments[1]),
          ]);
        });
    }
  }
};
