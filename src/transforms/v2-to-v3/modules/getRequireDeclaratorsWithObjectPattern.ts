import { Collection, JSCodeshift, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";
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
      if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) return false;
      const propertyValue = (property as Property | ObjectProperty).value;
      return propertyValue.type === "Identifier" && propertyValue.name === identifierName;
    });
  });
