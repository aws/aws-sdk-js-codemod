import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";

export interface V3ClientsNewExpressionCodeOptions {
  sortByPackageName?: boolean;
}

export const getV3ClientsNewExpressionCode = (
  clientsToTest: string[],
  options?: V3ClientsNewExpressionCodeOptions
) => {
  let content = ``;

  const { sortByPackageName = false } = options || {};
  const clientNames = sortByPackageName
    ? getClientNamesSortedByPackageName(clientsToTest)
    : clientsToTest;

  for (const clientName of clientNames) {
    content += `new ${clientName}();\n`;
  }
  return content;
};
