import type { Collection, JSCodeshift, ObjectPattern } from "jscodeshift";

import { PACKAGE_NAME } from "../../config";
import { objectPatternPropertyCompareFn } from "../objectPatternPropertyCompareFn";
import { getRequireDeclarators } from "../requireModule";
import type { ModulesOptions } from "../types";

export const addNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ModulesOptions
) => {
  const { localName, importedName = localName, packageName } = options;

  const clientObjectProperty = j.objectProperty.from({
    key: j.identifier(importedName),
    value: j.identifier(localName),
    shorthand: true,
  });
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
            if (property.type !== "Property" && property.type !== "ObjectProperty") {
              return false;
            }
            if (property.key.type !== "Identifier" || property.value.type !== "Identifier") {
              return false;
            }
            return property.key.name === importedName && property.value.name === localName;
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
  const v3RequireDeclaration = j.variableDeclaration("const", [
    j.variableDeclarator(
      j.objectPattern([clientObjectProperty]),
      j.callExpression(j.identifier("require"), [j.literal(packageName)])
    ),
  ]);

  const v2RequireCallExpressions = source
    .find(j.CallExpression, {
      callee: { type: "Identifier", name: "require" },
    })
    .filter((callExpression) => {
      const arg = callExpression.value.arguments[0];
      if (arg.type !== "Literal" && arg.type !== "StringLiteral") {
        return false;
      }
      return typeof arg.value === "string" && arg.value.startsWith(PACKAGE_NAME);
    });

  if (v2RequireCallExpressions.size()) {
    // Insert it after the first v2 require declaration.
    v2RequireCallExpressions.at(0).closest(j.VariableDeclaration).insertAfter(v3RequireDeclaration);
    return;
  }

  // Insert require declarator at the top of the document.
  source.get().node.program.body.unshift(v3RequireDeclaration);
};
