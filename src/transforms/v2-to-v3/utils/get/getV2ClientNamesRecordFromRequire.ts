import { Collection, Identifier, JSCodeshift, ObjectPattern, Property } from "jscodeshift";

import { CLIENT_NAMES, PACKAGE_NAME } from "../config";
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

export const getV2ClientNamesRecordFromRequire = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2ClientNamesWithServiceModule: string[]
) => {
  const v2ClientNamesRecord: Record<string, string> = {};

  const idPropertiesFromNamedImport = getRequireIds(j, source, PACKAGE_NAME)
    .filter((id) => id.type === "ObjectPattern")
    .map((objectPattern) => (objectPattern as ObjectPattern).properties)
    .flat() as Property[];

  for (const clientName of CLIENT_NAMES) {
    const propertyWithClientName = idPropertiesFromNamedImport.find(
      (property) => (property?.key as Identifier).name === clientName
    );
    if (propertyWithClientName) {
      v2ClientNamesRecord[clientName] = (propertyWithClientName.value as Identifier).name;
    }
  }

  for (const clientName of v2ClientNamesWithServiceModule) {
    const deepRequirePath = getV2ServiceModulePath(clientName);
    const idsFromDefaultImport = getRequireIds(j, source, deepRequirePath).filter(
      (id) => id.type === "Identifier"
    );
    if (idsFromDefaultImport.length) {
      v2ClientNamesRecord[clientName] = (idsFromDefaultImport[0] as Identifier).name;
    }
  }

  return v2ClientNamesRecord;
};
