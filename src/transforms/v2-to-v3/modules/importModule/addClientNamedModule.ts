import {
  Collection,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSCodeshift,
  Property,
  ObjectProperty,
} from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../../config";
import { getImportDeclaration } from "../getImportDeclaration";
import { getImportSpecifier } from "../getImportSpecifier";
import { getImportSpecifiers } from "../getImportSpecifiers";
import { getRequireProperty } from "../getRequireProperty";
import { importSpecifierCompareFn } from "../importSpecifierCompareFn";
import { objectPatternPropertyCompareFn } from "../objectPatternPropertyCompareFn";
import { ClientModulesOptions, ImportSpecifierOptions } from "../types";

export const addClientNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions & ImportSpecifierOptions
) => {
  const { importedName, v2ClientName, v2ClientLocalName, v3ClientPackageName } = options;
  const localName = options.localName ?? importedName;

  const importDeclarations = source.find(j.ImportDeclaration, {
    source: { value: v3ClientPackageName },
  });

  if (importDeclarations.size()) {
    const importSpecifiers = getImportSpecifiers(j, source, v3ClientPackageName);

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
          source: { value: v3ClientPackageName },
        })
        .insertAfter(varDeclaration);
      return;
    }

    // Add named import to the first import declaration.
    const firstImportDeclSpecifiers = importDeclarations.nodes()[0].specifiers;
    if (firstImportDeclSpecifiers) {
      firstImportDeclSpecifiers.push(getImportSpecifier(j, { importedName, localName }));
      firstImportDeclSpecifiers.sort(importSpecifierCompareFn);
      return;
    }
  }

  // Insert after global import, or service import.
  const v2ImportDeclaration = getImportDeclaration(j, source, {
    v2ClientName,
    v2ClientLocalName,
  });

  const v3ImportDeclaration = j.importDeclaration(
    [getImportSpecifier(j, { importedName, localName })],
    j.stringLiteral(v3ClientPackageName)
  );

  if (v2ImportDeclaration && v2ImportDeclaration.nodes().length > 0) {
    v2ImportDeclaration.at(0).insertAfter(v3ImportDeclaration);
  } else {
    // Unreachable code, throw error
    throw new Error(
      "Base Import Declaration not found to insert new Import Declaration.\n" +
        "Please report your use case on https://github.com/awslabs/aws-sdk-js-codemod"
    );
  }
};
