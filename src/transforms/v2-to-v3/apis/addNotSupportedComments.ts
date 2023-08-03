import { Collection, JSCodeshift, Property, ObjectProperty } from "jscodeshift";
import { getClientNamesFromDeepImport } from "../client-names";
import { DOCUMENT_CLIENT, DYNAMODB, OBJECT_PROPERTY_TYPE_LIST } from "../config";
import { hasRequire } from "../modules";
import { getClientDeepImportPath } from "../utils";

export const addNotSupportedComments = (j: JSCodeshift, source: Collection<unknown>) => {
  const clientNamesFromDeepImport = getClientNamesFromDeepImport(source.toSource());

  if (clientNamesFromDeepImport.includes(DYNAMODB)) {
    const deepImportPath = getClientDeepImportPath(DYNAMODB);

    const documentClientDeepNamedImportUnsupportedComments = [
      j.commentLine(
        " Transformation of DocumentClient named import from deep path is unsupported in aws-sdk-js-codemod."
      ),
      j.commentLine(" Please convert to a default import, and re-run aws-sdk-js-codemod."),
    ];

    if (hasRequire(j, source)) {
      source
        .find(j.VariableDeclarator, {
          init: {
            type: "CallExpression",
            callee: { type: "Identifier", name: "require" },
            arguments: [{ value: deepImportPath }],
          },
        })
        .filter(
          (variableDeclarator) =>
            variableDeclarator.value.id.type === "ObjectPattern" &&
            (variableDeclarator.value.id.properties || []).some((property) => {
              if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) {
                return false;
              }
              const propertyKey = (property as Property | ObjectProperty).key;
              return propertyKey.type === "Identifier" && propertyKey.name === DOCUMENT_CLIENT;
            })
        )
        .forEach((variableDeclarator) => {
          const comments = variableDeclarator.parentPath.parentPath.value.comments || [];
          variableDeclarator.parentPath.parentPath.value.comments = [
            ...comments,
            ...documentClientDeepNamedImportUnsupportedComments,
          ];
        });
      source
        .find(j.ImportDeclaration, {
          type: "ImportDeclaration",
          source: { value: deepImportPath },
        })
        .filter((importDeclaration) =>
          (importDeclaration.value.specifiers || []).some(
            (importDeclaration) =>
              importDeclaration.type === "ImportSpecifier" &&
              importDeclaration.imported.name === DOCUMENT_CLIENT
          )
        )
        .forEach((importDeclaration) => {
          const comments = importDeclaration.value.comments || [];
          importDeclaration.value.comments = [
            ...comments,
            ...documentClientDeepNamedImportUnsupportedComments,
          ];
        });
    }
  }
};
