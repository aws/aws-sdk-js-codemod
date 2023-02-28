import { LOCAL_NAME_SUFFIX } from "./config";

export interface V3ClientsNewExpressionCodeOptions {
  addLocalNameSuffix?: boolean;
}

export const getV3ClientsNewExpressionCode = (
  clientsToTest: string[],
  options?: V3ClientsNewExpressionCodeOptions
) => {
  let content = ``;

  const { addLocalNameSuffix = false } = options || {};
  for (const clientName of clientsToTest) {
    content += `new ${clientName}${addLocalNameSuffix ? LOCAL_NAME_SUFFIX : ""}();\n`;
  }
  return content;
};
