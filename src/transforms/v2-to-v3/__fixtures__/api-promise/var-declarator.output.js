import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB();

// Variable declarator
const listTablesPromise = client.listTables();
const listTagsOfResourcePromise = client.listTagsOfResource({ ResourceArn: "STRING_VALUE" });
