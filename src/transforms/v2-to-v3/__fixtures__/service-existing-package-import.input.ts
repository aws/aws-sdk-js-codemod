import DynamoDB from "aws-sdk/clients/dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client1 = new DynamoDB();
const client2 = new DynamoDBClient();