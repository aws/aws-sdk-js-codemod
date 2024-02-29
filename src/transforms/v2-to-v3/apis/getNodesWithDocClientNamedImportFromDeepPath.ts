import {
  Collection,
  JSCodeshift,
  ObjectProperty,
  Property,
  VariableDeclaration,
} from "jscodeshift";
import { DOCUMENT_CLIENT, DYNAMODB, OBJECT_PROPERTY_TYPE_LIST } from "../config";
import { ImportType } from "../modules";
import { getImportDeclarations } from "../modules/importModule";
import { getRequireDeclarators } from "../modules/requireModule";
import { getClientDeepImportPath } from "../utils";

export const getNodesWithDocClientNamedImportFromDeepPath = (
  j: JSCodeshift,
  source: Collection<unknown>,
  importType: ImportType
) => {
  const deepImportPath = getClientDeepImportPath(DYNAMODB);

  if (importType === ImportType.REQUIRE) {
    return getRequireDeclarators(j, source, deepImportPath)
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
      .map(
        (variableDeclarator) => variableDeclarator.parentPath.parentPath
      ) as Collection<VariableDeclaration>;
  }

  return getImportDeclarations(j, source, deepImportPath).filter((importDeclaration) =>
    (importDeclaration.value.specifiers || []).some(
      (importSpecifier) =>
        importSpecifier.type === "ImportSpecifier" &&
        importSpecifier.imported.name === DOCUMENT_CLIENT
    )
  );
};
