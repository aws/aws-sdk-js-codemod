import { CLIENT_NAMES_MAP } from "../../src/transforms/v2-to-v3/config/index.ts";

export const getV3ClientsNewExpressionCode = (clientsToTest: string[]) => {
  let content = "";
  for (const clientName of clientsToTest) {
    const clientConstructorName = CLIENT_NAMES_MAP[clientName] ?? clientName;
    content += `new ${clientConstructorName}();\n`;
  }
  return content;
};
