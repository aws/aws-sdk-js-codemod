import { Collection, JSCodeshift } from "jscodeshift";

import { getImportEqualsDeclaration } from "./getImportEqualsDeclaration";

export const hasImportEquals = (j: JSCodeshift, source: Collection<unknown>) =>
  source.find(j.TSImportEqualsDeclaration, getImportEqualsDeclaration()).size() > 0;
