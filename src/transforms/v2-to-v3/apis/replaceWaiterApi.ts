import type { Collection, JSCodeshift } from "jscodeshift";

import type { ClientIdentifier } from "../types.ts";
import { getArgsWithoutWaiterConfig } from "./getArgsWithoutWaiterConfig.ts";
import { getClientWaiterCallExpression } from "./getClientWaiterCallExpression.ts";
import { getClientWaiterStates } from "./getClientWaiterStates.ts";
import { getV3ClientWaiterApiName } from "./getV3ClientWaiterApiName.ts";
import { getWaiterConfig } from "./getWaiterConfig.ts";
import { getWaiterConfigValue } from "./getWaiterConfigValue.ts";

// Updates .waitFor() API with waitUntil* API.
export const replaceWaiterApi = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
): void => {
  for (const clientId of clientIdentifiers) {
    const waiterStates = getClientWaiterStates(j, source, clientIdentifiers);

    for (const waiterState of waiterStates) {
      source
        .find(j.CallExpression, getClientWaiterCallExpression(clientId, waiterState))
        .replaceWith((callExpression) => {
          let delay: string | undefined;
          let maxAttempts: string | undefined;

          const callArguments = callExpression.node.arguments;
          if (callArguments.length > 1 && callArguments[1].type === "ObjectExpression") {
            const waiterConfig = getWaiterConfig(callArguments[1]);
            if (waiterConfig) {
              delay = getWaiterConfigValue(waiterConfig, "delay");
              maxAttempts = getWaiterConfigValue(waiterConfig, "maxAttempts");
            }
          }

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

          const options = callExpression.node.arguments[1];
          const updatedOptions =
            options.type === "ObjectExpression" ? getArgsWithoutWaiterConfig(options) : options;
          return j.callExpression(j.identifier(getV3ClientWaiterApiName(waiterState)), [
            j.objectExpression(properties),
            updatedOptions,
          ]);
        });
    }
  }
};
