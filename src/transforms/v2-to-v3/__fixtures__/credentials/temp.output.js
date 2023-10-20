import { fromEnv, fromTemporaryCredentials } from "@aws-sdk/credential-providers";

const credentials = fromTemporaryCredentials({
  params: { RoleArn: "RoleA" },
  masterCredentials: fromEnv("AWS"),
});