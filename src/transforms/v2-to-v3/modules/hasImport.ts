import { Collection, JSCodeshift } from "jscodeshift";
import { PACKAGE_NAME } from "../config";

export const hasImport = (j: JSCodeshift, source: Collection<unknown>) =>
  source
    .find(j.ImportDeclaration)
    .filter((importDeclaration) => {
      const { value: sourceValue } = importDeclaration.value.source;
      return typeof sourceValue === "string" && sourceValue.startsWith(PACKAGE_NAME);
    })
    .size() > 0;
