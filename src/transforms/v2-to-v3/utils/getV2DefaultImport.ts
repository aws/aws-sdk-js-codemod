import { Collection, Identifier, JSCodeshift } from "jscodeshift";
import findImports from "jscodeshift-find-imports";

export const getV2DefaultImport = (
  j: JSCodeshift,
  source: Collection<any>
): Identifier | undefined => {
  const { statement } = j.template;
  const imports = findImports(source, statement`import AWS from 'aws-sdk'`);

  for (const importObj of Object.values(imports)) {
    if (importObj.type === "Identifier") return importObj;
  }

  return undefined;
};
