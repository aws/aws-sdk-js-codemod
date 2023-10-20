import AWS from "aws-sdk";

const credentials = new AWS.ChainableTemporaryCredentials({
  params: { RoleArn: "RoleA" },
  masterCredentials: new AWS.EnvironmentCredentials("AWS"),
});