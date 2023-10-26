import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();
// Used for testing. DynamoDB does not have upload API.
await client.upload({});