import { Collection, JSCodeshift, ObjectPattern, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST, PACKAGE_NAME, STRING_LITERAL_TYPE_LIST } from "../../config";
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
  const v3RequireDeclaration = j.variableDeclaration("const", [
    j.variableDeclarator(
      j.objectPattern([clientObjectProperty]),
      j.callExpression(j.identifier("require"), [j.literal(packageName)])
    ),
  ]);

  const v2RequireDeclarations = source.find(j.VariableDeclaration).filter((variableDeclaration) =>
    variableDeclaration.value.declarations.some(
      // @ts-expect-error Type 'JSXIdentifier' is not assignable to type 'Identifier'.
      (declaration: VariableDeclarator | Identifier) => {
        if (declaration.type === "Identifier") return false;

        const init = declaration.init;
        if (!init) return false;

        // Checks for require identifier or object pattern.
        if (init.type === "CallExpression") {
          const callee = init.callee;
          if (!callee) return false;
          if (callee.type !== "Identifier") return false;
          if (callee.name !== "require") return false;

          const args = init.arguments;
          if (!args) return false;
          if (args.length !== 1) return false;
          if (!STRING_LITERAL_TYPE_LIST.includes(args[0].type)) return true;
          if (typeof args[0].value !== "string") return false;
          if (!args[0].value.startsWith(PACKAGE_NAME)) return false;

          return true;
        }

        // Checks for require property.
        if (init.type === "MemberExpression") {
          const object = init.object;
          if (object.type !== "CallExpression") return false;

          const callee = object.callee;
          if (callee.type !== "Identifier") return false;
          if (callee.name !== "require") return false;

          const args = object.arguments;
          if (args.length !== 1) return false;
          if (!STRING_LITERAL_TYPE_LIST.includes(args[0].type)) return true;
          if (args[0].value !== PACKAGE_NAME) return false;

          return true;
        }

        return false;
      }
    )
  );

  if (v2RequireDeclarations.size()) {
    // Insert it after the first v2 require declaration.
    v2RequireDeclarations.at(0).insertAfter(v3RequireDeclaration);
    return;
  }

  // Insert require declarator at the top of the document.
  source.get().node.program.body.unshift(v3RequireDeclaration);
};
