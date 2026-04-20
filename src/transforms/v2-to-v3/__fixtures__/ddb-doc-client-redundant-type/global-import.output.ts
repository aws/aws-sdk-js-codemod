import AWS_DynamoDBDocumentClient from "@aws-sdk/lib-dynamodb";

// Native types
const stringType: string = "string";
const booleanType: boolean = true;
const numberType: number = 123;

// Date
const dateType: Date = new Date();

// Arrays
const stringArray: Array<string> = ["string1", "string2"];
const numberArray: Array<number> = [123, 456];
const structureArray: Array<AWS_DynamoDBDocumentClient.Endpoint> = [{ Address: "string", CachePeriodInMinutes: 5 }];