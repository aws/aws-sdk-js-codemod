import { Collection, JSCodeshift, ObjectPattern, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST, PACKAGE_NAME } from "../../config";
import { getRequireDeclarators } from "../getRequireDeclarators";
import { getRequireProperty } from "../getRequireProperty";
import { objectPatternPropertyCompareFn } from "../objectPatternPropertyCompareFn";
import { ModulesOptions } from "../types";

export const addNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ModulesOptions
) => {
  const { importedName, localName = importedName, packageName } = options;

  const clientObjectProperty = getRequireProperty(j, { importedName, localName });
  const existingRequires = getRequireDeclarators(j, source, packageName);

  if (existingRequires && existingRequires.nodes().length > 0) {
    const existingRequireProperties = existingRequires
      .filter((variableDeclarator) => variableDeclarator.value.id.type === "ObjectPattern")
      .nodes();

    if (
      existingRequireProperties.length > 0 &&
      existingRequireProperties.find(
        (variableDeclarator) =>
          variableDeclarator.id.type === "ObjectPattern" &&
          variableDeclarator.id.properties.find((property) => {
            if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) return false;
            const key = (property as Property | ObjectProperty).key;
            const value = (property as Property | ObjectProperty).value;
            if (key.type !== "Identifier" || value.type !== "Identifier") {
              return false;
            }
            return key.name === importedName && value.name === localName;
          })
      )
    ) {
      return;
    }

    if (existingRequireProperties.length > 0) {
      const firstRequireProperties = (existingRequireProperties[0].id as ObjectPattern).properties;
      firstRequireProperties.push(clientObjectProperty);
      firstRequireProperties.sort(objectPatternPropertyCompareFn);
      return;
    }
  }

  // Build a new require declarator.
  const v3RequireDeclarator = j.variableDeclarator(
    j.objectPattern([clientObjectProperty]),
    j.callExpression(j.identifier("require"), [j.literal(packageName)])
  );

  const v2RequireDeclarations = getRequireDeclarators(j, source, PACKAGE_NAME);
  if (v2RequireDeclarations.size()) {
    // Insert it after the first require declaration.
    v2RequireDeclarations.at(0).insertAfter(v3RequireDeclarator);
    return;
  }

  // Insert require declarator at the top of the document.
  source.get().node.program.body.unshift(j.variableDeclaration("const", [v3RequireDeclarator]));
};
