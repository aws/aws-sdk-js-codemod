import AWS_S3 from "@aws-sdk/client-s3";
import AWS_APIGateway from "@aws-sdk/client-api-gateway";

// Native types
const stringType: string = "string"; // string
const booleanType: boolean = true; // boolean
const numberType: number = 123; // number

// Date
const dateType: Date = new Date(); // Date

// Uint8Array
const blobType: Uint8Array = new Uint8Array();

// Arrays
const stringArray: string[] = ["string1", "string2"]; // string[]
const booleanArray: boolean[] = [true, false]; // boolean[]
const numberArray: number[] = [123, 456]; // number[]
const blobArray: Uint8Array[] = [new Uint8Array()]; // Uint8Array[]
const enumArray: AWS_S3.ChecksumAlgorithm[] = ["CRC32"]; // ChecksumAlgorithm[]
const structureArray: AWS_S3.Bucket[] = [{ Name: "bucketName" }]; // Bucket[]

// Maps
const stringMap: Record<string, string> = { key: "value" }; // Record<string, string>
const booleanMap: Record<string, boolean> = { key: true }; // Record<string, boolean>
const numberMap: Record<string, number> = { key: 123 }; // Record<string, number>
const structureMap: Record<string, AWS_APIGateway.MethodSnapshot> = { key: { apiKeyRequired: true } }; // Record<string, MethodSnapshot>

// Nested arrays
const arrayNestedTwice: number[][] = [[1, 2], [3, 4]]; // number[][]
const arrayNestedThrice: number[][][] = [[[1, 2], [3, 4]], [[4, 5], [6, 7]]]; // number[][][]
const arrayNestedFour: number[][][][] = [
  [[[1], [2]], [[3], [4]]],
  [[[5], [6]], [[7], [8]]]
]; // number[][][][]