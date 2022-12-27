import { V2_CLIENT_INPUT_SUFFIX_LIST, V2_CLIENT_OUTPUT_SUFFIX_LIST } from "../config";

export const getV3ClientTypeName = (v2ClientTypeName: string) => {
  for (const inputSuffix of V2_CLIENT_INPUT_SUFFIX_LIST) {
    if (v2ClientTypeName.endsWith(inputSuffix)) {
      return v2ClientTypeName.replace(new RegExp(`${inputSuffix}$`), "CommandInput");
    }
  }

  for (const outputSuffix of V2_CLIENT_OUTPUT_SUFFIX_LIST) {
    if (v2ClientTypeName.endsWith(outputSuffix)) {
      return v2ClientTypeName.replace(new RegExp(`${outputSuffix}$`), "CommandOutput");
    }
  }

  return undefined;
};
