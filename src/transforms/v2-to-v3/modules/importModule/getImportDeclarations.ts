import { Collection, JSCodeshift } from "jscodeshift";
import { PACKAGE_NAME } from "../../config";

export const getImportDeclarations = (j: JSCodeshift, source: Collection<unknown>, path?: string) =>
  source.find(j.ImportDeclaration).filter((importDeclaration) => {
    const sourceValue = importDeclaration.value.source.value;
    if (typeof sourceValue !== "string") {
      return false;
    }
    if (path) {
      return sourceValue === path;
    }
    return sourceValue.startsWith(PACKAGE_NAME);
  });
