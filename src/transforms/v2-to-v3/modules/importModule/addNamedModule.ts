import {
  Collection,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSCodeshift,
  Property,
  ObjectProperty,
} from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST, PACKAGE_NAME } from "../../config";
import { getImportSpecifiers } from "../getImportSpecifiers";
import { getRequireProperty } from "../getRequireProperty";
import { importSpecifierCompareFn } from "../importSpecifierCompareFn";
import { objectPatternPropertyCompareFn } from "../objectPatternPropertyCompareFn";
import { ModulesOptions } from "../types";

export const addNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ModulesOptions
) => {
  const { importedName, localName = importedName, packageName } = options;

  const importDeclarations = source.find(j.ImportDeclaration, {
    source: { value: packageName },
  });

  if (importDeclarations.size()) {
    const importSpecifiers = getImportSpecifiers(j, source, packageName);

    // Return if the import specifier already exists.
    if (
      importSpecifiers
        .filter((importSpecifier) => importSpecifier?.type === "ImportSpecifier")
        .find(
          (specifier) =>
            (specifier as ImportSpecifier)?.imported?.name === importedName &&
            specifier?.local?.name === localName
        )
    ) {
      return;
    }

    const importNamespaceSpecifiers = importSpecifiers.filter(
      (importSpecifier) => importSpecifier?.type === "ImportNamespaceSpecifier"
    ) as ImportNamespaceSpecifier[];

    // If namespace import exists.
    if (importNamespaceSpecifiers.length > 0) {
      const defaultLocalName = importNamespaceSpecifiers[0].local!.name;
      const namedImportObjectProperty = getRequireProperty(j, { importedName, localName });

      const existingVarDeclarator = source.find(j.VariableDeclarator, {
        type: "VariableDeclarator",
        init: { type: "Identifier", name: defaultLocalName },
      });

      // If variable declarator exists.
      if (existingVarDeclarator.size()) {
        // Return if property exists.
        if (
          existingVarDeclarator.some((varDeclarator) => {
            const id = varDeclarator.node.id;
            if (id.type !== "ObjectPattern") return false;
            for (const property of id.properties) {
              if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) continue;
              const propertyKey = (property as Property | ObjectProperty).key;
              if (propertyKey.type !== "Identifier") continue;
              if (propertyKey.name === importedName) return true;
            }
            return false;
          })
        )
          return;

        // Add property to the first declarator.
        const firstDeclaratorProperties = existingVarDeclarator.get(0).node.id.properties;
        firstDeclaratorProperties.push(namedImportObjectProperty);
        firstDeclaratorProperties.sort(objectPatternPropertyCompareFn);
        return;
      }

      const varDeclaration = j.variableDeclaration("const", [
        j.variableDeclarator(
          j.objectPattern([namedImportObjectProperty]),
          j.identifier(defaultLocalName)
        ),
      ]);

      source
        .find(j.ImportDeclaration, {
          type: "ImportDeclaration",
          specifiers: [importNamespaceSpecifiers[0]],
          source: { value: packageName },
        })
        .insertAfter(varDeclaration);
      return;
    }

    // Add named import to the first import declaration.
    const firstImportDeclSpecifiers = importDeclarations.nodes()[0].specifiers;
    if (firstImportDeclSpecifiers) {
      firstImportDeclSpecifiers.push(
        j.importSpecifier(j.identifier(importedName), j.identifier(localName))
      );
      firstImportDeclSpecifiers.sort(importSpecifierCompareFn);
      return;
    }
  }

  // Build a new import declaration.
  const v3ImportDeclaration = j.importDeclaration(
    [j.importSpecifier(j.identifier(importedName), j.identifier(localName))],
    j.stringLiteral(packageName)
  );

  const v2importDeclarations = source.find(j.ImportDeclaration).filter((path) => {
    const { value } = path.node.source;
    return typeof value === "string" && value.startsWith(PACKAGE_NAME);
  });

  if (v2importDeclarations.size()) {
    // Insert it after the last import declaration.
    v2importDeclarations.at(0).insertAfter(v3ImportDeclaration);
    return;
  }

  // Insert it at the top of the document.
  source.get().node.program.body.unshift(v3ImportDeclaration);
};
