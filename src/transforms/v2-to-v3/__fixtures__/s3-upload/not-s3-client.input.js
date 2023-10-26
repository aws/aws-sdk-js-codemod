import AWS from "aws-sdk";

const client = new AWS.DynamoDB();
// Used for testing. DynamoDB does not have upload API.
await client.upload({}).promise();