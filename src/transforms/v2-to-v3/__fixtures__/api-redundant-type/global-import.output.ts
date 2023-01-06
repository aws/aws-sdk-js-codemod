import AWS_APIGateway from "@aws-sdk/client-api-gateway";
import AWS_DynamoDB from "@aws-sdk/client-dynamodb";
import AWS_S3 from "@aws-sdk/client-s3";

// Native types
const stringType: string = "string";
const booleanType: boolean = true;
const numberType: number = 123;

// Date
const dateType: Date = new Date();

// Uint8Array
const blobType: Uint8Array = new Uint8Array();

// Arrays
const stringArray: Array<string> = ["string1", "string2"];
const booleanArray: Array<boolean> = [true, false];
const numberArray: Array<number> = [123, 456];
const blobArray: Array<Uint8Array> = [new Uint8Array()];
const enumArray: Array<AWS_S3.ChecksumAlgorithm> = ["CRC32"];
const structureArray: Array<AWS_S3.Bucket> = [{ Name: "bucketName" }];

// Maps
const stringMap: Record<string, string> = { key: "value" };
const booleanMap: Record<string, boolean> = { key: true };
const numberMap: Record<string, number> = { key: 123 };
const structureMap: Record<string, AWS_APIGateway.MethodSnapshot> = { key: { apiKeyRequired: true } };

// Nested arrays
const arrayNestedTwice: Array<Array<number>> = [[1, 2], [3, 4]];
const arrayNestedThrice: Array<Array<Array<number>>> = [[[1, 2], [3, 4]], [[4, 5], [6, 7]]];
const arrayNestedFour: Array<Array<Array<Array<number>>>> = [
  [[[1], [2]], [[3], [4]]],
  [[[5], [6]], [[7], [8]]]
];

// Nested maps
const mapNestedTwice: Record<string, Record<string, string>> = { key: stringMap };
const mapNestedTwiceStruct: Record<string, Record<string, AWS_APIGateway.MethodSnapshot>> = { key: structureMap };

// Nested arrays and maps
const mapOfArrays: Record<string, Array<string>> = { key: ["value"] };
const mapOfMapOfArrays: Record<string, Record<string, Array<string>>> = { key: mapOfArrays };
const mapOfArrayOfMaps: Record<string, Array<Record<string, AWS_DynamoDB.AttributeValue>>> = { key: [{ key: { S:"A" }}] };
const mapOfArrayOfArrays: Record<string, Array<Array<number>>> = { key: [[1], [2]] };
const arrayOfMaps: Array<Record<string, string>> = [stringMap];
const arrayOfMapOfArrays: Array<Record<string, Array<string>>> = [mapOfArrays];
const arrayOfMapOfMapOfArrays: Array<Record<string, Record<string, Array<string>>>> = [mapOfMapOfArrays];