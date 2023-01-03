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

  // ToDo: Handle v2 client name not present in v3.
  // Test case: https://github.com/awslabs/aws-sdk-js-codemod/pull/274
  return v2ClientTypeName;
};
