import AWS from "aws-sdk";

// Native types
const stringType: AWS.DynamoDB.DocumentClient.String = "string";
const booleanType: AWS.DynamoDB.DocumentClient.BooleanObject = true;
const numberType: AWS.DynamoDB.DocumentClient.Integer = 123;

// Date
const dateType: AWS.DynamoDB.DocumentClient.TableCreationDateTime = new Date();

// Arrays
const stringArray: AWS.DynamoDB.DocumentClient.AttributeNameList = ["string1", "string2"];
const numberArray: AWS.DynamoDB.DocumentClient.ItemCollectionSizeEstimateRange = [123, 456];
const structureArray: AWS.DynamoDB.DocumentClient.Endpoints = [{ Address: "string", CachePeriodInMinutes: 5 }];