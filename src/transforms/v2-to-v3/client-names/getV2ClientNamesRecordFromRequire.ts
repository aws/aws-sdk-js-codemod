import {
  Collection,
  Identifier,
  JSCodeshift,
  ObjectPattern,
  ObjectProperty,
  Property,
} from "jscodeshift";

import { CLIENT_NAMES, PACKAGE_NAME } from "../config";
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
    .flat()
    .filter(
      (property) =>
        (property.type === "Property" || property.type === "ObjectProperty") &&
        property.key.type === "Identifier" &&
        property.value.type === "Identifier"
    ) as (Property | ObjectProperty)[];

  for (const idProperty of idPropertiesFromObjectPattern) {
    const key = idProperty.key as Identifier;
    const value = idProperty.value as Identifier;
    if (CLIENT_NAMES.includes(key.name)) {
      v2ClientNamesRecord[key.name] = value.name;
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
