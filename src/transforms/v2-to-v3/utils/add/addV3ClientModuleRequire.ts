import {
  Collection,
  Identifier,
  JSCodeshift,
  ObjectPattern,
  Property,
  VariableDeclaration,
  VariableDeclarator,
} from "jscodeshift";

export const addV3ClientModuleRequire = (
  j: JSCodeshift,
  existingRequires: Collection<VariableDeclaration>,
  v3ClientProperty: Property
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
          ((property as Property).key as Identifier).name ===
          (v3ClientProperty.key as Identifier).name
      )
    )
  ) {
    (existingRequireProperties[0].id as ObjectPattern).properties.push(v3ClientProperty);
  }
};
