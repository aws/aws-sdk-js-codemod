import { DynamoDB as DynamoDBClient } from "aws-sdk";

const documentClient = new DynamoDBClient.DocumentClient({ region: "us-west-2" });
const response = await documentClient.scan({ TableName: "TABLE_NAME" }).promise();