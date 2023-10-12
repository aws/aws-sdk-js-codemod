/**
 * Maps the AWS credentials class name in v2 to the v3 equivalent provider.
 */
export const AWS_CREDENTIALS_MAP: Record<string, string> = {
  EnvironmentCredentials: "fromEnv",
};
