import DocumentClient from "aws-sdk/clients/dynamodb";

const document: DocumentClient.DocumentClient.WriteRequest = { PutRequest: { Item: { pk: "native" } } };
