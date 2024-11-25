import type {
  CallExpression,
  Collection,
  Identifier,
  JSCodeshift,
  ObjectPattern,
  VariableDeclarator,
} from "jscodeshift";
import { removeDeclaration } from "../removeDeclaration.ts";
import type { ImportSpecifierType } from "../types.ts";
import { getRequireDeclarators } from "./getRequireDeclarators.ts";

// ToDo: create utility to share with requireModule/addNamedModule
const isAnotherSpecifier = (j: JSCodeshift, source: Collection<unknown>, localName: string) =>
  source
    .find(j.VariableDeclarator, {
      id: { type: "ObjectPattern" },
      init: { type: "CallExpression", callee: { type: "Identifier", name: "require" } },
    })
    .filter((varDeclarator) => {
      const id = varDeclarator.value.id as ObjectPattern;
      if (
        id.properties.some((property) => {
          if (property.type !== "Property" && property.type !== "ObjectProperty") {
            return false;
          }
          return property.value.type === "Identifier" && property.value.name === localName;
        })
      )
        return true;

      const init = varDeclarator.value.init as CallExpression;
      const initArgs = init.arguments;
      if (!initArgs || initArgs.length !== 0) return false;

      if (initArgs[0].type !== "Literal" && initArgs[0].type !== "StringLiteral") return false;

      const sourceValue = initArgs[0].value;
      if (typeof sourceValue !== "string") return false;
      return sourceValue.startsWith("@aws-sdk/");
    })
    .size() > 0;

const isIdentifierRemovable = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { importedName, localName }: ImportSpecifierType
) => {
  // For identifier import, there's only one occurrence of local identifier.
  // For object pattern or import, there can be two occurrences: one imported identifier and one local identifier.
  const identifierNum = importedName && importedName === localName ? 2 : 1;

  // Either the identifiers are the only occurences on the page.
  // Or there's another specifier with the same name imported from JS SDK v3.
  const identifiers = source.find(j.Identifier, { name: localName });
  return identifiers.size() === identifierNum || isAnotherSpecifier(j, source, localName);
};

export const removeRequire = (j: JSCodeshift, source: Collection<unknown>) =>
  getRequireDeclarators(j, source).forEach((varDeclarator) => {
    // Explore using .closest() here.
    const varDeclaration = varDeclarator.parentPath.parentPath;

    // The declaration might have been removed in earlier iterations.
    if (!varDeclaration.value) {
      return;
    }

    // Removes variable declarator from the declarations.
    varDeclaration.value.declarations = varDeclaration.value.declarations.filter(
      (declaration: VariableDeclarator | Identifier) => {
        if (declaration.type === "Identifier") return true;

        const id = declaration.id;
        const init = declaration.init;

        switch (id.type) {
          case "Identifier": {
            const localName = id.name;

            // Get importedName from require property, if available.
            const importedName =
              init && init.type === "MemberExpression" && init.property.type === "Identifier"
                ? init.property.name
                : undefined;

            return !isIdentifierRemovable(j, source, { importedName, localName });
          }
          case "ObjectPattern": {
            id.properties = id.properties.filter((property) => {
              if (property.type !== "Property" && property.type !== "ObjectProperty") {
                return true;
              }

              if (property.key.type !== "Identifier" || property.value.type !== "Identifier") {
                return true;
              }

              const importedName = property.key.name;
              const localName = property.value.name;
              return !isIdentifierRemovable(j, source, { importedName, localName });
            });
            if (id.properties.length === 0) {
              return false;
            }
            return true;
          }
          default:
            return false;
        }
      }
    );

    // Remove VariableDeclaration if there are no declarations.
    if (varDeclaration.value.declarations?.length === 0) {
      removeDeclaration(j, source, varDeclaration);
    }
  });
