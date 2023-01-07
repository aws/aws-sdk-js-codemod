import { Collection, JSCodeshift, ObjectPattern } from "jscodeshift";

export interface GetRequireDeclaratorsWithObjectPattern {
  identifierName: string;
  sourceValue: string;
}

export const getRequireDeclaratorsWithObjectPattern = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { identifierName, sourceValue }: GetRequireDeclaratorsWithObjectPattern
) =>
  source
    .find(j.VariableDeclarator, {
      id: { type: "ObjectPattern" },
      init: {
        arguments: [{ value: sourceValue }],
        callee: { type: "Identifier", name: "require" },
        type: "CallExpression",
      },
      type: "VariableDeclarator",
    })
    .filter((declarator) => {
      const { properties } = declarator.value.id as ObjectPattern;
      return properties.some(
        (property) =>
          (property.type === "Property" || property.type === "ObjectProperty") &&
          property.value.type === "Identifier" &&
          property.value.name === identifierName
      );
    });
