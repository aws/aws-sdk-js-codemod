import AWS from "aws-sdk";

// Native types
const stringType: AWS.S3.AccountId = "string"; // string
const booleanType: AWS.S3.BucketKeyEnabled = true; // boolean
const numberType: AWS.S3.ContentLength = 123; // number

// Uint8Array
const blobType: AWS.ACM.CertificateBodyBlob = new Uint8Array();

// Arrays
const stringArray: AWS.S3.AllowedHeaders = ["string1", "string2"]; // string[]
const booleanArray: AWS.RDSDataService.BooleanArray = [true, false]; // boolean[]
const numberArray: AWS.RDSDataService.LongArray = [123, 456]; // number[]
const blobArray: AWS.IoTFleetWise.NetworkFilesList = [new Uint8Array()]; // Uint8Array[]
const enumArray: AWS.S3.ChecksumAlgorithmList = ["CRC32"]; // ChecksumAlgorithm[]
const structureArray: AWS.S3.Buckets = [{ Name: "bucketName" }]; // Bucket[]