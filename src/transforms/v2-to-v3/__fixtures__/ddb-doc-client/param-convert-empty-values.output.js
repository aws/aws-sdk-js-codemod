import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const documentClient = DynamoDBDocument.from(new DynamoDB(), {
  marshallOptions: {
    convertEmptyValues: true,
  },
});