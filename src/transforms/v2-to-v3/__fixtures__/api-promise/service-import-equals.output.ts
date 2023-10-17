import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");
import DynamoDB = AWS_DynamoDB.DynamoDB;

const client = new DynamoDB();
const data = await client.listTables();