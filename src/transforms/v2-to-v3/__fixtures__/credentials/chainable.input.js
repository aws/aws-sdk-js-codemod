import AWS from "aws-sdk";

new AWS.ChainableTemporaryCredentials({
  params: { RoleArn: "RoleA" },
  masterCredentials: existingCredentials,
});