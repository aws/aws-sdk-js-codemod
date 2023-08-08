const AWS = require("aws-sdk");

// Native types
const stringType: typeof AWS.S3.AccountId = "string";
const booleanType: typeof AWS.S3.BucketKeyEnabled = true;
const numberType: typeof AWS.S3.ContentLength = 123;

// Date
const dateType: typeof AWS.S3.CreationDate = new Date();

// Uint8Array
const blobType: typeof AWS.RDSDataService._Blob = new Uint8Array();

// Arrays
const stringArray: typeof AWS.S3.AllowedHeaders = ["string1", "string2"];
const booleanArray: typeof AWS.RDSDataService.BooleanArray = [true, false];
const numberArray: typeof AWS.RDSDataService.LongArray = [123, 456];
const blobArray: typeof AWS.IoTFleetWise.NetworkFilesList = [new Uint8Array()];
const enumArray: typeof AWS.S3.ChecksumAlgorithmList = ["CRC32"];
const structureArray: typeof AWS.S3.Buckets = [{ Name: "bucketName" }];

// Maps
const stringMap: typeof AWS.S3.Metadata = { key: "value" };
const booleanMap: typeof AWS.APIGateway.MapOfStringToBoolean = { key: true };
const numberMap: typeof AWS.SSM.AssociationStatusAggregatedCount = { key: 123 };
const structureMap: typeof AWS.APIGateway.MapOfMethodSnapshot = { key: { apiKeyRequired: true } };

// Nested arrays
const arrayNestedTwice: typeof AWS.SageMakerGeospatial.LinearRing = [[1, 2], [3, 4]];
const arrayNestedThrice: typeof AWS.SageMakerGeospatial.LinearRings = [[[1, 2], [3, 4]], [[4, 5], [6, 7]]];
const arrayNestedFour: typeof AWS.SageMakerGeospatial.LinearRingsList = [
  [[[1], [2]], [[3], [4]]],
  [[[5], [6]], [[7], [8]]]
];

// Nested maps
const mapNestedTwice: typeof AWS.LexModelsV2.ConditionMap = { key: stringMap };
const mapNestedTwiceStruct: typeof AWS.APIGateway.PathToMapOfMethodSnapshot = { key: structureMap };

// Nested arrays and maps
const mapOfArrays: typeof AWS.NetworkManager.FilterMap = { key: ["value"] };
const mapOfMapOfArrays: typeof AWS.AppIntegrations.ObjectConfiguration = { key: mapOfArrays };
const mapOfArrayOfMaps: typeof AWS.DynamoDB.BatchGetResponseMap = { key: [{ key: { S:"A" }}] };
const mapOfArrayOfArrays: typeof AWS.APIGateway.MapOfKeyUsages = { key: [[1], [2]] };
const arrayOfMaps: typeof AWS.SSM.InventoryItemEntryList = [stringMap];
const arrayOfMapOfArrays: typeof AWS.SSM.TargetMaps = [mapOfArrays];