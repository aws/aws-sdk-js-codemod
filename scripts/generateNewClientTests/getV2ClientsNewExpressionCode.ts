export const getV2ClientsNewExpressionCode = (clientsToTest: string[], prefix?: string) => {
  let content = "";
  for (const clientName of clientsToTest) {
    content += `new ${prefix || ""}${clientName}();\n`;
  }
  return content;
};
