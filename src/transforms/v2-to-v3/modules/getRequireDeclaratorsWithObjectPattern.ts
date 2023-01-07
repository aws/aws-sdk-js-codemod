import { Collection, JSCodeshift } from "jscodeshift";

import { getRequireDeclarators } from "./getRequireDeclarators";

export interface GetRequireDeclaratorsWithObjectPattern {
  identifierName: string;
  sourceValue: string;
}

export const getRequireDeclaratorsWithObjectPattern = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { identifierName, sourceValue }: GetRequireDeclaratorsWithObjectPattern
) =>
  getRequireDeclarators(j, source, sourceValue).filter((declarator) => {
    if (declarator.value.id.type !== "ObjectPattern") {
      return false;
    }
    const { properties } = declarator.value.id;
    return properties.some(
      (property) =>
        (property.type === "Property" || property.type === "ObjectProperty") &&
        property.value.type === "Identifier" &&
        property.value.name === identifierName
    );
  });
