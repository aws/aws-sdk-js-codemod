import type { Collection, JSCodeshift } from "jscodeshift";
import { getImportEqualsDeclarations } from "./importEqualsModule/index.ts";

export const hasImportEquals = (j: JSCodeshift, source: Collection<unknown>) =>
  getImportEqualsDeclarations(j, source).size() > 0;
