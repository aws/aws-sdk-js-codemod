import { Collection, JSCodeshift } from "jscodeshift";
import findImports from "jscodeshift-find-imports";

import { CLIENT_NAMES } from "./config";

export const getV2ClientImportNames = (j: JSCodeshift, source: Collection<any>): string[] => {
  const v2ClientImportNames = [];
  const { statement } = j.template;

  for (const clientName of CLIENT_NAMES) {
    const individualImport = `aws-sdk/clients/${clientName.toLowerCase()}`;
    const imports = findImports(source, statement`import AWS from '${individualImport}'`);

    for (const importObj of Object.values(imports)) {
      if (importObj.type === "Identifier") v2ClientImportNames.push(importObj.name);
    }
  }

  return v2ClientImportNames;
};
