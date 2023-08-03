// Transformation DocumentClient named import is unsupported in aws-sdk-js-codemod.
// Please convert to a default import, and rerun codemod.
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const documentClient = new DocumentClient({ region: "us-west-2" });
const response = await documentClient.scan({ TableName: "TABLE_NAME" }).promise();