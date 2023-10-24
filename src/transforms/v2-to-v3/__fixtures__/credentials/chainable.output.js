import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";

// JS SDK v3 switched credential providers from classes to functions.
// This is the closest approximation from codemod of what your application needs.
// Reference: https://www.npmjs.com/package/@aws-sdk/credential-providers
fromTemporaryCredentials({
  params: { RoleArn: "RoleA" },
  masterCredentials: existingCredentials,
});