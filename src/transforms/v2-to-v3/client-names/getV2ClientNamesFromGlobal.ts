import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES, DYNAMODB_CLIENT_NAME, DYNAMODB_DOCUMENT_CLIENT_NAME } from "../config";
import { getNamesFromNewExpr } from "./getNamesFromNewExpr";
import { getNamesFromTSQualifiedName } from "./getNamesFromTSQualifiedName";

export const getV2ClientNamesFromGlobal = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] => {
  const namesFromNewExpr = getNamesFromNewExpr(j, source, v2GlobalName);
  const namesFromTSQualifiedName = getNamesFromTSQualifiedName(j, source, v2GlobalName);

  const v2ClientNames = new Set([...namesFromNewExpr, ...namesFromTSQualifiedName]);

  const ddbDocumentClientName = [
    v2GlobalName,
    DYNAMODB_CLIENT_NAME,
    DYNAMODB_DOCUMENT_CLIENT_NAME,
  ].join(".");
  if (source.toSource().includes(ddbDocumentClientName)) {
    v2ClientNames.add(DYNAMODB_CLIENT_NAME);
  }

  return [...v2ClientNames].filter((name) => CLIENT_NAMES.includes(name));
};
