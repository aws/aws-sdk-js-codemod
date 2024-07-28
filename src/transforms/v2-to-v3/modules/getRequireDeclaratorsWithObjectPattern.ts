import type { Collection, JSCodeshift } from "jscodeshift";

import { getRequireDeclarators } from "./requireModule";

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
    return properties.some((property) => {
      if (property.type !== "Property" && property.type !== "ObjectProperty") {
        return false;
      }
      return property.value.type === "Identifier" && property.value.name === identifierName;
    });
  });
