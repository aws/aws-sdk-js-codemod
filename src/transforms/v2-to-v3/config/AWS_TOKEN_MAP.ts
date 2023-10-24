/**
 * Maps the AWS token class name in v2 to the v3 equivalent provider.
 */
export const AWS_TOKEN_MAP: Record<string, string> = {
  SSOTokenProvider: "fromSso",
  StaticTokenProvider: "fromStatic",
};
