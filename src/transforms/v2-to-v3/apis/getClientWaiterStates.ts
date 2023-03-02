import { Collection, JSCodeshift } from "jscodeshift";

import { getClientIdentifiers } from "./getClientIdentifiers";

export interface GetClientWaiterStatesOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const getClientWaiterStates = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetClientWaiterStatesOptions
): Set<string> => {
  const waiterStates: string[] = [];

  const clientIdentifiers = getClientIdentifiers(j, source, options);

  for (const clientId of clientIdentifiers) {
    source
      .find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: clientId,
          property: { type: "Identifier", name: "waitFor" },
        },
      })
      .forEach((waiterCallExpression) => {
        // @ts-expect-error arguments[0] is Literal or StringLiteral
        const waiterState = waiterCallExpression.value.arguments[0].value;
        waiterStates.push(waiterState);
      });
  }

  return new Set(waiterStates);
};
