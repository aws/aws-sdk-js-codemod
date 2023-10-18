import AWS_client_dynamodb = require("@aws-sdk/client-dynamodb");
import DynamoDB = AWS_client_dynamodb.DynamoDB;

const client = new DynamoDB();
const data = await client.listTables();