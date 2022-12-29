import { Collection, Identifier, JSCodeshift, ObjectPattern, Property } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath } from "./getV2ServiceModulePath";

const getRequireIds = (j: JSCodeshift, source: Collection<unknown>, sourceValue: string) =>
  source
    .find(j.VariableDeclarator, {
      init: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "require" },
        arguments: [{ value: sourceValue }],
      },
    })
    .nodes()
    .map((variableDeclarator) => variableDeclarator.id);

export const getRequireIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientName: string
): string | undefined => {
  const idPropertiesFromNamedImport = getRequireIds(j, source, PACKAGE_NAME)
    .filter((id) => id.type === "ObjectPattern")
    .map((objectPattern) => (objectPattern as ObjectPattern).properties)
    .flat() as Property[];

  const propertyWithClientName = idPropertiesFromNamedImport.find(
    (property) => (property?.key as Identifier).name === clientName
  );
  if (propertyWithClientName) {
    return (propertyWithClientName.value as Identifier).name;
  }

  const deepRequirePath = getV2ServiceModulePath(clientName);
  const idsFromDefaultImport = getRequireIds(j, source, deepRequirePath).filter(
    (id) => id.type === "Identifier"
  );
  if (idsFromDefaultImport.length) {
    return (idsFromDefaultImport[0] as Identifier).name;
  }
};
