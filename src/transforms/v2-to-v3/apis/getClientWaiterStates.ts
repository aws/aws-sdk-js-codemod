import { Collection, JSCodeshift } from "jscodeshift";
import { ClientIdentifier } from "../types";

export const getClientWaiterStates = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
): Set<string> => {
  const waiterStates: string[] = [];

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
