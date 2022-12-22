import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/utils/config";

export const getGlobalImportInputContent = (codegenComment: string) => {
  let globalImportInputContent = `${codegenComment}\n`;

  globalImportInputContent += `import AWS from "aws-sdk";\n\n`;

  // Add new AWS.V2Client() for each client.
  for (const clientName of CLIENT_NAMES) {
    globalImportInputContent += `new AWS.${clientName}();\n`;
  }

  return globalImportInputContent;
};
