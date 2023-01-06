import AWS = require("aws-sdk");

// Native types
const stringType: AWS.S3.AccountId = "string";
const booleanType: AWS.S3.BucketKeyEnabled = true;
const numberType: AWS.S3.ContentLength = 123;

// Date
const dateType: AWS.S3.CreationDate = new Date();

// Uint8Array
const blobType: AWS.RDSDataService._Blob = new Uint8Array();

// Arrays
const stringArray: AWS.S3.AllowedHeaders = ["string1", "string2"];
const booleanArray: AWS.RDSDataService.BooleanArray = [true, false];
const numberArray: AWS.RDSDataService.LongArray = [123, 456];
const blobArray: AWS.IoTFleetWise.NetworkFilesList = [new Uint8Array()];
const enumArray: AWS.S3.ChecksumAlgorithmList = ["CRC32"];
const structureArray: AWS.S3.Buckets = [{ Name: "bucketName" }];

// Maps
const stringMap: AWS.S3.Metadata = { key: "value" };
const booleanMap: AWS.APIGateway.MapOfStringToBoolean = { key: true };
const numberMap: AWS.SSM.AssociationStatusAggregatedCount = { key: 123 };
const structureMap: AWS.APIGateway.MapOfMethodSnapshot = { key: { apiKeyRequired: true } };

// Nested arrays
const arrayNestedTwice: AWS.SageMakerGeospatial.LinearRing = [[1, 2], [3, 4]];
const arrayNestedThrice: AWS.SageMakerGeospatial.LinearRings = [[[1, 2], [3, 4]], [[4, 5], [6, 7]]];
const arrayNestedFour: AWS.SageMakerGeospatial.LinearRingsList = [
  [[[1], [2]], [[3], [4]]],
  [[[5], [6]], [[7], [8]]]
];

// Nested maps
const mapNestedTwice: AWS.LexModelsV2.ConditionMap = { key: stringMap };
const mapNestedTwiceStruct: AWS.APIGateway.PathToMapOfMethodSnapshot = { key: structureMap };

// Nested arrays and maps
const mapOfArrays: AWS.NetworkManager.FilterMap = { key: ["value"] };
const mapOfMapOfArrays: AWS.SecurityLake.AllDimensionsMap = { key: mapOfArrays };
const mapOfArrayOfMaps: AWS.DynamoDB.BatchGetResponseMap = { key: [{ key: { S:"A" }}] };
const mapOfArrayOfArrays: AWS.APIGateway.MapOfKeyUsages = { key: [[1], [2]] };
const arrayOfMaps: AWS.SSM.InventoryItemEntryList = [stringMap];
const arrayOfMapOfArrays: AWS.SSM.TargetMaps = [mapOfArrays];
const arrayOfMapOfMapOfArrays: AWS.SecurityLake.RegionSourceTypesAccountsList = [mapOfMapOfArrays];