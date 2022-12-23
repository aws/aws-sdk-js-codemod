import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/utils/config";

export const getV2ServiceImportsCode = () => {
  let v2ServiceImportsCode = ``;
  for (const clientName of CLIENT_NAMES) {
    v2ServiceImportsCode += `import ${clientName} from "aws-sdk/clients/${clientName.toLowerCase()}";\n`;
  }
  return v2ServiceImportsCode;
};
