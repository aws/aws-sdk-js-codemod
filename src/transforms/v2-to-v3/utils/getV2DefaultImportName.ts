import { Collection, JSCodeshift } from "jscodeshift";
import findImports from "jscodeshift-find-imports";

export const getV2DefaultImportName = (
  j: JSCodeshift,
  source: Collection<any>
): string | undefined => {
  const { statement } = j.template;
  const imports = findImports(source, statement`import AWS from 'aws-sdk'`);

  for (const importObj of Object.values(imports)) {
    if (importObj.type === "Identifier") return importObj.name;
  }

  return undefined;
};
