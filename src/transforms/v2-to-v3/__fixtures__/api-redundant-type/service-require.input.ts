const { APIGateway } = require("aws-sdk");
const { DynamoDB } = require("aws-sdk");
const { IoTFleetWise } = require("aws-sdk");
const { LexModelsV2 } = require("aws-sdk");
const { NetworkManager } = require("aws-sdk");
const { RDSDataService } = require("aws-sdk");
const { S3 } = require("aws-sdk");
const { SageMakerGeospatial } = require("aws-sdk");
const { AppIntegrations } = require("aws-sdk");
const { SSM } = require("aws-sdk");

// Native types
const stringType: typeof S3.AccountId = "string";
const booleanType: typeof S3.BucketKeyEnabled = true;
const numberType: typeof S3.ContentLength = 123;

// Date
const dateType: typeof S3.CreationDate = new Date();

// Uint8Array
const blobType: typeof RDSDataService._Blob = new Uint8Array();

// Arrays
const stringArray: typeof S3.AllowedHeaders = ["string1", "string2"];
const booleanArray: typeof RDSDataService.BooleanArray = [true, false];
const numberArray: typeof RDSDataService.LongArray = [123, 456];
const blobArray: typeof IoTFleetWise.NetworkFilesList = [new Uint8Array()];
const enumArray: typeof S3.ChecksumAlgorithmList = ["CRC32"];
const structureArray: typeof S3.Buckets = [{ Name: "bucketName" }];

// Maps
const stringMap: typeof S3.Metadata = { key: "value" };
const booleanMap: typeof APIGateway.MapOfStringToBoolean = { key: true };
const numberMap: typeof SSM.AssociationStatusAggregatedCount = { key: 123 };
const structureMap: typeof APIGateway.MapOfMethodSnapshot = { key: { apiKeyRequired: true } };

// Nested arrays
const arrayNestedTwice: typeof SageMakerGeospatial.LinearRing = [[1, 2], [3, 4]];
const arrayNestedThrice: typeof SageMakerGeospatial.LinearRings = [[[1, 2], [3, 4]], [[4, 5], [6, 7]]];
const arrayNestedFour: typeof SageMakerGeospatial.LinearRingsList = [
  [[[1], [2]], [[3], [4]]],
  [[[5], [6]], [[7], [8]]]
];

// Nested maps
const mapNestedTwice: typeof LexModelsV2.ConditionMap = { key: stringMap };
const mapNestedTwiceStruct: typeof APIGateway.PathToMapOfMethodSnapshot = { key: structureMap };

// Nested arrays and maps
const mapOfArrays: typeof NetworkManager.FilterMap = { key: ["value"] };
const mapOfMapOfArrays: typeof AppIntegrations.ObjectConfiguration = { key: mapOfArrays };
const mapOfArrayOfMaps: typeof DynamoDB.BatchGetResponseMap = { key: [{ key: { S:"A" }}] };
const mapOfArrayOfArrays: typeof APIGateway.MapOfKeyUsages = { key: [[1], [2]] };
const arrayOfMaps: typeof SSM.InventoryItemEntryList = [stringMap];
const arrayOfMapOfArrays: typeof SSM.TargetMaps = [mapOfArrays];