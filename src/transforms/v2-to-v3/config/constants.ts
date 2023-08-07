export const PACKAGE_NAME = "aws-sdk";

export const S3 = "S3";
export const DYNAMODB = "DynamoDB";
export const DOCUMENT_CLIENT = "DocumentClient";
export const DYNAMODB_DOCUMENT = "DynamoDBDocument";
export const DYNAMODB_DOCUMENT_CLIENT = [DYNAMODB, DOCUMENT_CLIENT].join(".");

export const V2_CLIENT_INPUT_SUFFIX_LIST = ["Input", "Request"];
export const V2_CLIENT_OUTPUT_SUFFIX_LIST = ["Output", "Response"];

export const OBJECT_PROPERTY_TYPE_LIST = ["Property", "ObjectProperty"];
export const FUNCTION_TYPE_LIST = [
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunctionExpression",
];
