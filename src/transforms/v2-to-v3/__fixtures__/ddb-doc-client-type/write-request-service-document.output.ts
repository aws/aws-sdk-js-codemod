import { BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb";

const document: NonNullable<BatchWriteCommandInput["RequestItems"]>[string][number] = { PutRequest: { Item: { pk: "native" } } };
