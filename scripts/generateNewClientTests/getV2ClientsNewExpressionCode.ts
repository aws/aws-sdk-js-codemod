export const getV2ClientsNewExpressionCode = (clientsToTest: string[], prefix?: string) => {
  let v2ClientsNewExpressionCode = ``;
  for (const clientName of clientsToTest) {
    v2ClientsNewExpressionCode += `new ${prefix || ""}${clientName}();\n`;
  }
  return v2ClientsNewExpressionCode;
};
