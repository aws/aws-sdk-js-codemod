import AWS from "aws-sdk";

// Native types
const stringType: AWS.S3.AccountId = "string"; // string
const booleanType: AWS.S3.BucketKeyEnabled = true; // boolean
const numberType: AWS.S3.ContentLength = 123; // number

// Date
const dateType: AWS.S3.CreationDate = new Date(); // Date

// Uint8Array
const blobType: AWS.RDSDataService._Blob = new Uint8Array();

// Arrays
const stringArray: AWS.S3.AllowedHeaders = ["string1", "string2"]; // string[]
const booleanArray: AWS.RDSDataService.BooleanArray = [true, false]; // boolean[]
const numberArray: AWS.RDSDataService.LongArray = [123, 456]; // number[]
const blobArray: AWS.IoTFleetWise.NetworkFilesList = [new Uint8Array()]; // Uint8Array[]
const enumArray: AWS.S3.ChecksumAlgorithmList = ["CRC32"]; // ChecksumAlgorithm[]
const structureArray: AWS.S3.Buckets = [{ Name: "bucketName" }]; // Bucket[]

// Maps
const stringMap: AWS.S3.Metadata = { key: "value" }; // Record<string, string>
const booleanMap: AWS.APIGateway.MapOfStringToBoolean = { key: true }; // Record<string, boolean>
const numberMap: AWS.SSM.AssociationStatusAggregatedCount = { key: 123 }; // Record<string, number>
const structureMap: AWS.APIGateway.MapOfMethodSnapshot = { key: { apiKeyRequired: true } }; // Record<string, MethodSnapshot>

// Nested arrays
const arrayNestedTwice: AWS.SageMakerGeospatial.LinearRing = [[1, 2], [3, 4]]; // number[][]
const arrayNestedThrice: AWS.SageMakerGeospatial.LinearRings = [[[1, 2], [3, 4]], [[4, 5], [6, 7]]]; // number[][][]
const arrayNestedFour: AWS.SageMakerGeospatial.LinearRingsList = [
  [[[1], [2]], [[3], [4]]],
  [[[5], [6]], [[7], [8]]]
]; // number[][][][]