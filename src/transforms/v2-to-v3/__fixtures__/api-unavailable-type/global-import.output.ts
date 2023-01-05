import AWS_S3 from "@aws-sdk/client-s3";

// Native types
const stringType: string = "string"; // string
const booleanType: boolean = true; // boolean
const numberType: number = 123; // number

// Uint8Array
const blobType: Uint8Array = new Uint8Array();

// Arrays
const stringArray: string[] = ["string1", "string2"]; // string[]
const booleanArray: boolean[] = [true, false]; // boolean[]
const numberArray: number[] = [123, 456]; // number[]
const enumArray: AWS_S3.ChecksumAlgorithm[] = ["CRC32"]; // ChecksumAlgorithm[]
const structureArray: AWS_S3.Bucket[] = [{ Name: "bucketName" }]; // Bucket[]