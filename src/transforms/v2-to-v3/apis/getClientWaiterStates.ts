import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientIdentifiers } from "./getV2ClientIdentifiers";

export interface GetClientWaiterStatesOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const getClientWaiterStates = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetClientWaiterStatesOptions
): string[] => {
  const waiterStates: string[] = [];

  const v2ClientIdentifiers = getV2ClientIdentifiers(j, source, options);

  for (const v2ClientId of v2ClientIdentifiers) {
    source
      .find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: v2ClientId,
          property: { type: "Identifier", name: "waitFor" },
        },
      })
      .forEach((waiterCallExpression) => {
        // @ts-expect-error arguments[0] is Literal or StringLiteral
        const waiterState = waiterCallExpression.value.arguments[0].value;
        waiterStates.push(waiterState);
      });
  }

  return waiterStates;
};
