/**
 * Maps the AWS credentials class name in v2 to the v3 equivalent provider.
 */
export const AWS_CREDENTIALS_MAP: Record<string, string> = {
  ChainableTemporaryCredentials: "fromTemporaryCredentials",
  CognitoIdentityCredentials: "fromCognitoIdentity",
  EC2MetadataCredentials: "fromInstanceMetadata",
  ECSCredentials: "fromContainerMetadata",
  EnvironmentCredentials: "fromEnv",
  ProcessCredentials: "fromProcess",
  RemoteCredentials: "fromContainerMetadata",
  SharedIniFileCredentials: "fromIni",
  SsoCredentials: "fromSSO",
  TokenFileWebIdentityCredentials: "fromTokenFile",
  WebIdentityCredentials: "fromWebToken",
};
