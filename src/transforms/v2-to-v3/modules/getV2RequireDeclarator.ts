import { Collection, Identifier, JSCodeshift, ObjectPattern } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath } from "../utils";
import { getRequireDeclaratorsWithIdentifier } from "./getRequireDeclaratorsWithIdentifier";
import { getRequireDeclaratorsWithObjectPattern } from "./getRequireDeclaratorsWithObjectPattern";

export interface GetV2BaseDeclaratorOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const getV2RequireDeclarator = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: GetV2BaseDeclaratorOptions
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

  const v2ServiceModulePath = getV2ServiceModulePath(v2ClientName);
  const requireDeclaratorsWithIdentifier = getRequireDeclaratorsWithIdentifier(j, source, {
    identifierName: v2ClientLocalName,
    sourceValue: v2ServiceModulePath,
  });

  if (requireDeclaratorsWithIdentifier.size() > 0) {
    return requireDeclaratorsWithIdentifier;
  }
};
