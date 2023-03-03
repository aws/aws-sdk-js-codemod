import { DynamoDB } from "aws-sdk";

const documentClient = new DynamoDB.DocumentClient({ region: "us-west-2" });
const response = await documentClient.scan({ TableName: "TABLE_NAME" }).promise();