import { Collection, Identifier, JSCodeshift } from "jscodeshift";

export interface GetClientIdentifierNamesOptions {
  v2ClientName: string;
  v2DefaultModuleName: string;
}

export const getClientIdentifierNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2DefaultModuleName, v2ClientName }: GetClientIdentifierNamesOptions
): string[] =>
  source
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
