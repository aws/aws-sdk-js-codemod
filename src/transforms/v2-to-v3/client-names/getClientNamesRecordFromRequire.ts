import {
  Collection,
  Identifier,
  JSCodeshift,
  ObjectPattern,
  ObjectProperty,
  Property,
} from "jscodeshift";

import { CLIENT_NAMES, OBJECT_PROPERTY_TYPE_LIST, PACKAGE_NAME } from "../config";
import { getRequireDeclaratorsWithProperty } from "../modules";
import { getClientDeepImportPath } from "../utils";
import { getRequireIds } from "./getRequireIds";

export const getClientNamesRecordFromRequire = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientNamesWithServiceModule: string[]
) => {
  const clientNamesRecord: Record<string, string> = {};

  const idPropertiesFromObjectPattern = getRequireIds(j, source, PACKAGE_NAME)
    .filter((id) => id.type === "ObjectPattern")
    .map((objectPattern) => (objectPattern as ObjectPattern).properties)
    .flat();

  for (const idProperty of idPropertiesFromObjectPattern) {
    if (!OBJECT_PROPERTY_TYPE_LIST.includes(idProperty.type)) {
      continue;
    }
    const key = (idProperty as Property | ObjectProperty).key;
    const value = (idProperty as Property | ObjectProperty).value;
    if (key.type !== "Identifier" || value.type !== "Identifier") {
      continue;
    }
    if (CLIENT_NAMES.includes(key.name)) {
      clientNamesRecord[key.name] = value.name;
    }
  }

  const declaratorsWithProperty = getRequireDeclaratorsWithProperty(j, source, {
    sourceValue: PACKAGE_NAME,
  }).nodes();

  for (const declaratorWithProperty of declaratorsWithProperty) {
    const { id, init } = declaratorWithProperty;
    if (
      id.type === "Identifier" &&
      init != undefined &&
      init.type === "MemberExpression" &&
      init.property.type === "Identifier"
    ) {
      const clientName = (init.property as Identifier).name;
      if (CLIENT_NAMES.includes(clientName)) {
        clientNamesRecord[clientName] = (id as Identifier).name;
      }
    }
  }

  for (const clientName of clientNamesWithServiceModule) {
    const deepImportPath = getClientDeepImportPath(clientName);
    const idsFromDefaultImport = getRequireIds(j, source, deepImportPath).filter(
      (id) => id.type === "Identifier"
    );
    if (idsFromDefaultImport.length) {
      clientNamesRecord[clientName] = (idsFromDefaultImport[0] as Identifier).name;
    }
  }

  return clientNamesRecord;
};
