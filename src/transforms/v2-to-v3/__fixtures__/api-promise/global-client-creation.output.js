import { DynamoDB } from "@aws-sdk/client-dynamodb";

const data = await new DynamoDB().listTables();