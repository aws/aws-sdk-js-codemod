import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientIdentifiers, getV2ClientIdThisExpressions } from "../get";
import { removePromiseForCallExpression } from "./removePromiseForCallExpression";

export interface RemovePromiseCallsOptions {
  v2ClientName: string;
  v2DefaultModuleName: string;
}

// Removes .promise() from client API calls.
export const removePromiseCalls = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2DefaultModuleName, v2ClientName }: RemovePromiseCallsOptions
): void => {
  const v2ClientIdentifiers = getV2ClientIdentifiers(j, source, {
    v2DefaultModuleName,
    v2ClientName,
  });
  const v2ClientIdThisExpressions = getV2ClientIdThisExpressions(j, source, v2ClientIdentifiers);

  for (const v2ClientId of [...v2ClientIdentifiers, ...v2ClientIdThisExpressions]) {
    source
      .find(j.CallExpression, {
        callee: {
          type: "MemberExpression",
          object: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              object: v2ClientId,
            },
          },
          property: { type: "Identifier", name: "promise" },
        },
      })
      .forEach((callExpression) => {
        removePromiseForCallExpression(callExpression);
      });
  }
};
