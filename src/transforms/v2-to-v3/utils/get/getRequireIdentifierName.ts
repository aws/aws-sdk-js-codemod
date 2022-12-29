import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getV2ServiceModulePath } from "./getV2ServiceModulePath";

export const getRequireIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientName: string
): string | undefined => {
  const sourceValue = getV2ServiceModulePath(clientName);
  return (
    source
      .find(j.VariableDeclarator, {
        id: { type: "Identifier" },
        init: {
          type: "CallExpression",
          callee: { type: "Identifier", name: "require" },
          arguments: [{ value: sourceValue }],
        },
      })
      .nodes()[0]?.id as Identifier
  )?.name;
};
