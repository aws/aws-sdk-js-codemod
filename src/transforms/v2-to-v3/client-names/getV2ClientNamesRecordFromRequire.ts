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
import { getV2ServiceModulePath } from "../utils";
import { getRequireIds } from "./getRequireIds";

export const getV2ClientNamesRecordFromRequire = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2ClientNamesWithServiceModule: string[]
) => {
  const v2ClientNamesRecord: Record<string, string> = {};

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
      v2ClientNamesRecord[key.name] = value.name;
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
      const v2ClientName = (init.property as Identifier).name;
      if (CLIENT_NAMES.includes(v2ClientName)) {
        v2ClientNamesRecord[v2ClientName] = (id as Identifier).name;
      }
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
