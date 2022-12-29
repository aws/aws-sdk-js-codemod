import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequireCode } from "./getV3PackageRequireCode";

export const getGlobalRequireOutput = (codegenComment: string) => {
  let globalRequireOutputContent = `${codegenComment}\n\n`;

  globalRequireOutputContent += getV3PackageRequireCode(getClientNamesSortedByPackageName(), {
    extraNewLine: true,
  });
  globalRequireOutputContent += getV3ClientsNewExpressionCode();

  return globalRequireOutputContent;
};
