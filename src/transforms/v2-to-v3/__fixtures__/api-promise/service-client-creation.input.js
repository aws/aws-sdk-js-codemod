import { DynamoDB } from "aws-sdk";

const data = await new DynamoDB().listTables().promise();