export const getV3ClientsNewExpressionCode = (clientsToTest: string[]) => {
  let v3ClientsNewExpressionCode = ``;
  for (const v2ClientName of clientsToTest) {
    v3ClientsNewExpressionCode += `new ${v2ClientName}();\n`;
  }
  return v3ClientsNewExpressionCode;
};
