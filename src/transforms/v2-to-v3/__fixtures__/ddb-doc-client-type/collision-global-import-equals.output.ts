import AWS_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
import BatchWriteCommandInput = AWS_lib_dynamodb.BatchWriteCommandInput;
import AWS_client_dynamodb = require("@aws-sdk/client-dynamodb");
import WriteRequest = AWS_client_dynamodb.WriteRequest;

const raw: WriteRequest = {};
const document: NonNullable<BatchWriteCommandInput["RequestItems"]>[string][number] = {};
