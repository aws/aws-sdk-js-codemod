export const PACKAGE_NAME = "aws-sdk";

export const S3 = "S3";
export const DYNAMODB = "DynamoDB";
export const DOCUMENT_CLIENT = "DocumentClient";
export const DYNAMODB_DOCUMENT = "DynamoDBDocument";
export const DYNAMODB_DOCUMENT_CLIENT = [DYNAMODB, DOCUMENT_CLIENT].join(".");

export const OBJECT_PROPERTY_TYPE_LIST = ["Property", "ObjectProperty"];
export const FUNCTION_TYPE_LIST = [
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunctionExpression",
];

export const NOT_SUPPORTED_COMMENT = "not supported in AWS SDK for JavaScript (v3)";
