import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";

export interface GetV2ClientIdNamesOptions {
  v2ClientName: string;
  v2DefaultModuleName: string;
}

export const getV2ClientIdNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2DefaultModuleName, v2ClientName }: GetV2ClientIdNamesOptions
): string[] => {
  const clientIdentifierNamesFromDefaultImport = source
    .find(j.VariableDeclarator, {
      id: { type: "Identifier" },
      init: {
        type: "NewExpression",
        callee: {
          object: { type: "Identifier", name: v2DefaultModuleName },
          property: { type: "Identifier", name: v2ClientName },
        },
      },
    })
    .nodes()
    .map((variableDeclarator) => (variableDeclarator.id as Identifier).name);

  const clientIdentifierNamesFromClientImport = source
    .find(j.VariableDeclarator, {
      id: { type: "Identifier" },
      init: {
        type: "NewExpression",
        callee: { type: "Identifier", name: v2ClientName },
      },
    })
    .nodes()
    .map((variableDeclarator) => (variableDeclarator.id as Identifier).name);

  return getMergedArrayWithoutDuplicates(
    clientIdentifierNamesFromDefaultImport,
    clientIdentifierNamesFromClientImport
  );
};
