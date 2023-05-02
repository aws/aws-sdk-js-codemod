import { Collection, JSCodeshift } from "jscodeshift";

import { getNamesFromNewExpr } from "./getNamesFromNewExpr";
import { getNamesFromTSQualifiedName } from "./getNamesFromTSQualifiedName";
import { CLIENT_NAMES } from "../config";

export const getClientNamesFromGlobal = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] => {
  const namesFromNewExpr = getNamesFromNewExpr(j, source, v2GlobalName);
  const namesFromTSQualifiedName = getNamesFromTSQualifiedName(j, source, v2GlobalName);

  return [...new Set([...namesFromNewExpr, ...namesFromTSQualifiedName])].filter((name) =>
    CLIENT_NAMES.includes(name)
  );
};
