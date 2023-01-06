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
const stringArray: string[] = ["string1", "string2"];
const booleanArray: boolean[] = [true, false];
const numberArray: number[] = [123, 456];
const blobArray: Uint8Array[] = [new Uint8Array()];
const enumArray: AWS_S3.ChecksumAlgorithm[] = ["CRC32"];
const structureArray: AWS_S3.Bucket[] = [{ Name: "bucketName" }];

// Maps
const stringMap: Record<string, string> = { key: "value" };
const booleanMap: Record<string, boolean> = { key: true };
const numberMap: Record<string, number> = { key: 123 };
const structureMap: Record<string, AWS_APIGateway.MethodSnapshot> = { key: { apiKeyRequired: true } };

// Nested arrays
const arrayNestedTwice: number[][] = [[1, 2], [3, 4]];
const arrayNestedThrice: number[][][] = [[[1, 2], [3, 4]], [[4, 5], [6, 7]]];
const arrayNestedFour: number[][][][] = [
  [[[1], [2]], [[3], [4]]],
  [[[5], [6]], [[7], [8]]]
];

// Nested maps
const mapNestedTwice: Record<string, Record<string, string>> = { key: stringMap };
const mapNestedTwiceStruct: Record<string, Record<string, AWS_APIGateway.MethodSnapshot>> = { key: structureMap };

// Nested arrays and maps
const mapOfArrays: Record<string, string[]> = { key: ["value"] };
const mapOfMapOfArrays: Record<string, Record<string, string[]>> = { key: mapOfArrays };
const mapOfArrayOfMaps: Record<string, Record<string, AWS_DynamoDB.AttributeValue>[]> = { key: [{ key: { S:"A" }}] };
const mapOfArrayOfArrays: Record<string, number[][]> = { key: [[1], [2]] };
const arrayOfMaps: Record<string, string>[] = [stringMap];
const arrayOfMapOfArrays: Record<string, string[]>[] = [mapOfArrays];
const arrayOfMapOfMapOfArrays: Record<string, Record<string, string[]>>[] = [mapOfMapOfArrays];