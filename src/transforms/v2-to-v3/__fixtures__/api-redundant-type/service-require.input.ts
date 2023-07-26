const { APIGateway } = require("aws-sdk");
const { DynamoDB } = require("aws-sdk");
const { IoTFleetWise } = require("aws-sdk");
const { LexModelsV2 } = require("aws-sdk");
const { NetworkManager } = require("aws-sdk");
const { RDSDataService } = require("aws-sdk");
const { S3 } = require("aws-sdk");
const { SageMakerGeospatial } = require("aws-sdk");
const { SecurityLake } = require("aws-sdk");
const { SSM } = require("aws-sdk");

// Native types
const stringType: S3.AccountId = "string";
const booleanType: S3.BucketKeyEnabled = true;
const numberType: S3.ContentLength = 123;

// Date
const dateType: S3.CreationDate = new Date();

// Uint8Array
const blobType: RDSDataService._Blob = new Uint8Array();

// Arrays
const stringArray: S3.AllowedHeaders = ["string1", "string2"];
const booleanArray: RDSDataService.BooleanArray = [true, false];
const numberArray: RDSDataService.LongArray = [123, 456];
const blobArray: IoTFleetWise.NetworkFilesList = [new Uint8Array()];
const enumArray: S3.ChecksumAlgorithmList = ["CRC32"];
const structureArray: S3.Buckets = [{ Name: "bucketName" }];

// Maps
const stringMap: S3.Metadata = { key: "value" };
const booleanMap: APIGateway.MapOfStringToBoolean = { key: true };
const numberMap: SSM.AssociationStatusAggregatedCount = { key: 123 };
const structureMap: APIGateway.MapOfMethodSnapshot = { key: { apiKeyRequired: true } };

// Nested arrays
const arrayNestedTwice: SageMakerGeospatial.LinearRing = [[1, 2], [3, 4]];
const arrayNestedThrice: SageMakerGeospatial.LinearRings = [[[1, 2], [3, 4]], [[4, 5], [6, 7]]];
const arrayNestedFour: SageMakerGeospatial.LinearRingsList = [
  [[[1], [2]], [[3], [4]]],
  [[[5], [6]], [[7], [8]]]
];

// Nested maps
const mapNestedTwice: LexModelsV2.ConditionMap = { key: stringMap };
const mapNestedTwiceStruct: APIGateway.PathToMapOfMethodSnapshot = { key: structureMap };

// Nested arrays and maps
const mapOfArrays: NetworkManager.FilterMap = { key: ["value"] };
const mapOfMapOfArrays: AppIntegrations.ObjectConfiguration = { key: mapOfArrays };
const mapOfArrayOfMaps: DynamoDB.BatchGetResponseMap = { key: [{ key: { S:"A" }}] };
const mapOfArrayOfArrays: APIGateway.MapOfKeyUsages = { key: [[1], [2]] };
const arrayOfMaps: SSM.InventoryItemEntryList = [stringMap];
const arrayOfMapOfArrays: SSM.TargetMaps = [mapOfArrays];