import { Collection, JSCodeshift } from "jscodeshift";
import { getImportDeclarations } from "./importModule";

export const hasImport = (j: JSCodeshift, source: Collection<unknown>) =>
  getImportDeclarations(j, source).size() > 0;
