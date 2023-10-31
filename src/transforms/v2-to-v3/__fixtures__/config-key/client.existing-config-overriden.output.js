import AWS from "aws-sdk";

import { DynamoDB } from "@aws-sdk/client-dynamodb";

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
AWS.config.region = "us-west-2";

const client = new DynamoDB({
  region: "us-east-1"
});