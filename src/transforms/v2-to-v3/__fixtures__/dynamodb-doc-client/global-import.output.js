import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const documentClient = DynamoDBDocument.from(new DynamoDB({ region: "us-west-2" }));
const response = await documentClient.scan({ TableName: "TABLE_NAME" });