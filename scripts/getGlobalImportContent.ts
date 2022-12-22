import {
  CLIENT_NAMES,
  CLIENT_NAMES_MAP,
  CLIENT_PACKAGE_NAMES_MAP,
} from "../src/transforms/v2-to-v3/utils/config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";

export const getGlobalImportInputContent = (codegenComment: string) => {
  let globalImportInputContent = `${codegenComment}\n`;

  globalImportInputContent += `import AWS from "aws-sdk";\n\n`;

  // Add new AWS.V2Client() for each client.
  for (const clientName of CLIENT_NAMES) {
    globalImportInputContent += `new AWS.${clientName}();\n`;
  }

  return globalImportInputContent;
};

export const getGlobalImportOutputContent = (codegenComment: string) => {
  let globalImportOutputContent = `${codegenComment}\n`;

  // Add new import for each client sorted alphabetically by package name.
  for (const v2ClientName of getClientNamesSortedByPackageName()) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    globalImportOutputContent += `import { ${v3ClientName} } from "${v3ClientPackageName}";\n`;
  }

  globalImportOutputContent += `\n`;

  // Add new V3Client() for each client following v2 Client order.
  for (const v2ClientName of CLIENT_NAMES) {
    globalImportOutputContent += `new ${CLIENT_NAMES_MAP[v2ClientName]}();\n`;
  }

  return globalImportOutputContent;
};
