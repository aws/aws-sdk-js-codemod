import {
  Collection,
  Identifier,
  JSCodeshift,
  ObjectPattern,
  ObjectProperty,
  Property,
  VariableDeclarator,
} from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";
import { getRequireDeclaratorsWithObjectPattern } from "./getRequireDeclaratorsWithObjectPattern";

export interface RemoveRequireObjectPropertyOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireObjectProperty = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireObjectPropertyOptions
) => {
  const requireDeclarators = getRequireDeclaratorsWithObjectPattern(j, source, {
    identifierName: localName,
    sourceValue,
  });

  requireDeclarators.forEach((varDeclarator) => {
    // Remove ObjectProperty from Variable Declarator.
    const varDeclaratorId = varDeclarator.value.id as ObjectPattern;
    varDeclaratorId.properties = varDeclaratorId.properties.filter((property) => {
      if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) return true;
      const propertyValue = (property as Property | ObjectProperty).value;
      return propertyValue.type !== "Identifier" || propertyValue.name !== localName;
    });

    // Remove VariableDeclarator if there are no properties.
    if (varDeclaratorId.properties.length === 0) {
      const varDeclaration = varDeclarator.parentPath.parentPath;
      varDeclaration.value.declarations = varDeclaration.value.declarations.filter(
        (declaration: VariableDeclarator | Identifier) => declaration !== varDeclarator.value
      );

      // Remove VariableDeclaration if there are no declarations.
      if (varDeclaration.value.declarations?.length === 0) {
        j(varDeclaration).remove();
      }
    }
  });
};
