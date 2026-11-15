import { BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { WriteRequest } from "@aws-sdk/client-dynamodb";

const raw: Record<string, Array<WriteRequest>> = {};
const document: Record<string, Array<NonNullable<BatchWriteCommandInput["RequestItems"]>[string][number]>> = { table: [{ PutRequest: { Item: { pk: "native" } } }] };
