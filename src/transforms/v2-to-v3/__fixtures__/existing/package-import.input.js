import AWS from "aws-sdk";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client1 = new AWS.DynamoDB();
const client2 = new DynamoDBClient();