import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const params = { region: "us-west-2" };
const documentClient = DynamoDBDocument.from(new DynamoDB(params));