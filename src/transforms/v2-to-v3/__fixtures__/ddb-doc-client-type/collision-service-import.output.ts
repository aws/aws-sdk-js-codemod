import { BatchWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { WriteRequest } from "@aws-sdk/client-dynamodb";

const raw: WriteRequest = {};
const document: NonNullable<BatchWriteCommandInput["RequestItems"]>[string][number] = {};
