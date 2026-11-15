import { BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { WriteRequest } from "@aws-sdk/client-dynamodb";

const raw: Array<WriteRequest> = [];
const document: Array<NonNullable<BatchWriteCommandInput["RequestItems"]>[string][number]> = [];
const more: NonNullable<BatchWriteCommandInput["RequestItems"]>[string][number] = {};
