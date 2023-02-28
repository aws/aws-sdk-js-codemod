export const getV3ClientsNewExpressionCode = (clientsToTest: string[]) => {
  let content = ``;
  for (const clientName of clientsToTest) {
    content += `new ${clientName}();\n`;
  }
  return content;
};
