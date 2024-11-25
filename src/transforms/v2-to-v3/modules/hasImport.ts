import type { Collection, JSCodeshift } from "jscodeshift";
import { getImportDeclarations } from "./importModule/index.ts";

export const hasImport = (j: JSCodeshift, source: Collection<unknown>) =>
  getImportDeclarations(j, source).size() > 0;
