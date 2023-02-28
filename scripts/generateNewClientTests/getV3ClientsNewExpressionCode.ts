export const getV3ClientsNewExpressionCode = (clientsToTest: string[]) => {
  let content = ``;
  for (const v2ClientName of clientsToTest) {
    content += `new ${v2ClientName}();\n`;
  }
  return content;
};
