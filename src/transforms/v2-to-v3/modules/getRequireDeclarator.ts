import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getClientDeepImportPath } from "../utils";
import { getRequireDeclaratorsWithIdentifier } from "./getRequireDeclaratorsWithIdentifier";
import { getRequireDeclaratorsWithObjectPattern } from "./getRequireDeclaratorsWithObjectPattern";
import { getRequireDeclaratorsWithProperty } from "./getRequireDeclaratorsWithProperty";

export interface GetRequireDeclaratorOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const getRequireDeclarator = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: GetRequireDeclaratorOptions
) => {
  if (v2GlobalName) {
    const requireDeclaratorsWithIdentifier = getRequireDeclaratorsWithIdentifier(j, source, {
      identifierName: v2GlobalName,
      sourceValue: PACKAGE_NAME,
    });

    if (requireDeclaratorsWithIdentifier.size() > 0) {
      return requireDeclaratorsWithIdentifier;
    }
  }

  const requireDeclaratorsWithObjectPattern = getRequireDeclaratorsWithObjectPattern(j, source, {
    identifierName: v2ClientLocalName,
    sourceValue: PACKAGE_NAME,
  });

  if (requireDeclaratorsWithObjectPattern.size() > 0) {
    return requireDeclaratorsWithObjectPattern;
  }

  const requireDeclaratorsWithProperty = getRequireDeclaratorsWithProperty(j, source, {
    identifierName: v2ClientName,
    sourceValue: PACKAGE_NAME,
  });

  if (requireDeclaratorsWithProperty.size() > 0) {
    return requireDeclaratorsWithProperty;
  }

  const requireDeclaratorsWithIdentifier = getRequireDeclaratorsWithIdentifier(j, source, {
    identifierName: v2ClientLocalName,
    sourceValue: getClientDeepImportPath(v2ClientName),
  });

  if (requireDeclaratorsWithIdentifier.size() > 0) {
    return requireDeclaratorsWithIdentifier;
  }
};
