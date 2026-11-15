import { BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { WriteRequest } from "@aws-sdk/client-dynamodb";

const raw: WriteRequest = { PutRequest: { Item: { pk: { S: "raw" } } } };
const document: NonNullable<BatchWriteCommandInput["RequestItems"]>[string][number] = { PutRequest: { Item: { pk: "document" } } };
