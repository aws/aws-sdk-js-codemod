import { Collection, Identifier, JSCodeshift } from "jscodeshift";
import { ObjectPattern, Property, VariableDeclarator } from "jscodeshift";

import { getV3ClientRequireProperty } from "./getV3ClientRequireProperty";
import { V3ClientRequirePropertyOptions } from "./types";

export const addV3ClientModuleRequire = (
  j: JSCodeshift,
  existingRequires: Collection<VariableDeclarator>,
  { keyName, valueName }: V3ClientRequirePropertyOptions
) => {
  const existingRequireProperties = existingRequires.nodes() as VariableDeclarator[];

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
