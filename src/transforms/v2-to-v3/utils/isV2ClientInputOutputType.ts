import { V2_CLIENT_INPUT_SUFFIX_LIST, V2_CLIENT_OUTPUT_SUFFIX_LIST } from "./config";

export const isV2ClientInputOutputType = (v2ClientTypeName: string) =>
  [...V2_CLIENT_INPUT_SUFFIX_LIST, ...V2_CLIENT_OUTPUT_SUFFIX_LIST].some((suffix) =>
    v2ClientTypeName.endsWith(suffix)
  );
