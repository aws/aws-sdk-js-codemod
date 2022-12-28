import {
  Collection,
  Identifier,
  JSCodeshift,
  ObjectPattern,
  Property,
  VariableDeclaration,
  VariableDeclarator,
} from "jscodeshift";

import { getV3ClientRequireProperty, V3ClientRequirePropertyOptions } from "../get";

export const addV3ClientModuleRequire = (
  j: JSCodeshift,
  existingRequires: Collection<VariableDeclaration>,
  { keyName, valueName }: V3ClientRequirePropertyOptions
) => {
  const existingRequireProperties = existingRequires
    .nodes()
    .map((node) =>
      node.declarations.filter((declaration) => declaration.type === "VariableDeclarator")
    )
    .flat() as VariableDeclarator[];

  if (
    !existingRequireProperties.find((variableDeclarator) =>
      (variableDeclarator.id as ObjectPattern).properties.find(
        (property) =>
          ((property as Property).key as Identifier).name === keyName &&
          ((property as Property).value as Identifier).name === valueName
      )
    )
  ) {
    (existingRequireProperties[0].id as ObjectPattern).properties.push(
      getV3ClientRequireProperty(j, { keyName, valueName })
    );
  }
};
