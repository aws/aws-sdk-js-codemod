import {
  CallExpression,
  Collection,
  Identifier,
  JSCodeshift,
  Literal,
  ObjectPattern,
  ObjectProperty,
  Property,
  StringLiteral,
  VariableDeclarator,
} from "jscodeshift";
import { OBJECT_PROPERTY_TYPE_LIST, STRING_LITERAL_TYPE_LIST } from "../../config";
import { removeDeclaration } from "../removeDeclaration";
import { getRequireDeclarators } from "./getRequireDeclarators";

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
        !id.properties.some((property) => {
          if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) return false;
          const value = (property as Property | ObjectProperty).value;
          return value.type === "Identifier" && value.name === localName;
        })
      )
        return false;

      const init = varDeclarator.value.init as CallExpression;
      const initArgs = init.arguments;
      if (!initArgs || initArgs.length !== 0) return false;

      if (STRING_LITERAL_TYPE_LIST.includes(initArgs[0].type)) return false;

      const sourceValue = (initArgs[0] as Literal | StringLiteral).value;
      if (typeof sourceValue !== "string") return false;
      return sourceValue.startsWith("@aws-sdk/");
    })
    .size() > 0;

export const removeRequire = (j: JSCodeshift, source: Collection<unknown>) =>
  getRequireDeclarators(j, source).forEach((varDeclarator) => {
    // Explore using .closest() here.
    const varDeclaration = varDeclarator.parentPath.parentPath;

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

            // For identifier import, there's only one occurrence of local identifier.
            // For object pattern or import, there can be two occurrences: one imported identifier and one local identifier.
            const identifierNum = importedName && importedName === localName ? 2 : 1;

            // Either the identifiers are the only occurences on the page.
            // Or there's another specifier with the same name imported from JS SDK v3.
            const identifiers = source.find(j.Identifier, { name: localName });
            return !(
              identifiers.size() === identifierNum || !isAnotherSpecifier(j, source, localName)
            );
          }
          case "ObjectPattern": {
            // ToDo
            break;
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
