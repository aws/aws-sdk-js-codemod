import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB as DynamoDBClient } from "@aws-sdk/client-dynamodb";

const documentClient = DynamoDBDocument.from(new DynamoDBClient({ region: "us-west-2" }));
const response = await documentClient.scan({ TableName: "TABLE_NAME" });