import AWS from "aws-sdk";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client1 = new AWS.DynamoDB();
const client2 = new DynamoDB();