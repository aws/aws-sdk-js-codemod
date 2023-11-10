## Static imports

The codemod detects static imports from the code written in the different ways below, and transforms them to their equivalent static imports in v3.

<table>
  <tr>
    <th>Name</th>
    <th>Example</th>
  </tr>
  <tr>
    <td>Default Import</td>
    <td>
<pre lang="javascript">
import AWS from "aws-sdk";
</pre>
    </td>
  </tr>
  <tr>
    <td>Namespace Import</td>
    <td>
<pre lang="javascript">
import * as AWS from "aws-sdk";
</pre>
    </td>
  </tr>
  <tr>
    <td>Variable Require</td>
    <td>
<pre lang="javascript">
const AWS = require("aws-sdk");
</pre>
    </td>
  </tr>
  <tr>
    <td>Import Equals</td>
    <td>
<pre lang="javascript">
import AWS = require(“aws-sdk");
</pre>
    </td>
  </tr>
  <tr>
    <td>Named Import</td>
    <td>
<pre lang="javascript">
import { DynamoDB } from "aws-sdk";
</pre>
    </td>
  </tr>
  <tr>
    <td>ObjectPattern Require</td>
    <td>
<pre lang="javascript">
const { DynamoDB } = require("aws-sdk");
</pre>
    </td>
  </tr>
  <tr>
    <td>Named Import with a local name</td>
    <td>
<pre lang="javascript">
import { DynamoDB as DynDB } from "aws-sdk";
</pre>
    </td>
  </tr>
  <tr>
    <td>ObjectPattern Require with a local name</td>
    <td>
<pre lang="javascript">
const { DynamoDB: DynDB } = require("aws-sdk");
</pre>
    </td>
  </tr>
  <tr>
    <td>Variable Require Property</td>
    <td>
<pre lang="javascript">
const DynamoDB = require("aws-sdk").DynamoDB;
</pre>
    </td>
  </tr>
  <tr>
    <td>Variable Require Property with a local name</td>
    <td>
<pre lang="javascript">
const DynDB = require("aws-sdk").DynamoDB;
</pre>
    </td>
  </tr>
  <tr>
    <td>Default Import with deep path</td>
    <td>
<pre lang="javascript">
import DynamoDB from "aws-sdk/clients/dynamodb";
</pre>
    </td>
  </tr>
  <tr>
    <td>Namespace Import with deep path</td>
    <td>
<pre lang="javascript">
import * as DynamoDB from "aws-sdk/clients/dynamodb";
</pre>
    </td>
  </tr>
  <tr>
    <td>Variable Require with deep path</td>
    <td>
<pre lang="javascript">
const DynamoDB = require("aws-sdk/clients/dynamodb");
</pre>
    </td>
  </tr>
  <tr>
    <td>Import Equals with deep path</td>
    <td>
<pre lang="javascript">
import DynamoDB = require(“aws-sdk/clients/dynamodb”);
</pre>
    </td>
  </tr>
</table>

Example

```js
// Before (SDK v2)
import AWS from "aws-sdk";
const client = new AWS.DynamoDB();
```

```js
// After (SDK v3)
import { DynamoDB } from "@aws-sdk/client-dynamodb";
const client = new DynamoDB();
```

## Client creation

<table>
  <tr>
    <th>Name</th>
    <th>Before (SDK v2)</th>
    <th>After (SDK v3)</th>
  </tr>
  <tr>
    <td>Client name same in v2 vs v3</td>
    <td>
<pre lang="javascript">
import AWS from "aws-sdk";
const client = new AWS.S3();
</pre>
    </td>
    <td>
<pre lang="javascript">
import { S3 } from "@aws-sdk/client-s3";
const client = new S3();
</pre>
    </td>
  </tr>
  <tr>
    <td>Client name different in v2 vs v3</td>
    <td>
<pre lang="javascript">
import AWS from "aws-sdk";
const client = new AWS.IotData();
</pre>
    </td>
    <td>
<pre lang="javascript">
import { IoTDataPlane } from “@aws-sdk/client-iot-data-plane";
const client = new IoTDataPlane();
</pre>
    </td>
  </tr>
  <tr>
    <td>Client with local name</td>
    <td>
<pre lang="javascript">
import { DynamoDB as DynDB } from "aws-sdk";
const client = new DynDB();
</pre>
    </td>
    <td>
<pre lang="javascript">
import { DynamoDB as DynDB } from "@aws-sdk/client-dynamodb";
const client = new DynDB();
</pre>
    </td>
  </tr>
</table>

## Config in clients

Simple configuration which is deprecated, and not needed.

```js
// Before (SDK v2)
const client = new AWS.DynamoDB({
  correctClockSkew: true,
});
```

```js
// After (SDK v3)
const client = new DynamoDB({
  // The key correctClockSkew is no longer supported in v3, and can be removed.
  // @deprecated The clock skew correction is applied by default.
  correctClockSkew: true,
});
```

Simple configuration which is not supported

```js
// Before (SDK v2)
const client = new AWS.DynamoDB({
  convertResponseTypes: true,
});
```

```js
// After (SDK v3)
const client = new DynamoDB({
  // The key convertResponseTypes is no longer supported in v3, and can be removed.
  // @deprecated Not type-safe. It doesn't convert time stamp or base64 binaries from the JSON response.
  convertResponseTypes: true,
});
```

Simple configuration which is replaced

```js
// Before (SDK v2)
const client = new AWS.DynamoDB({
  accessKeyId: "KEY",
  secretAccessKey: "SECRET",
});
```

```js
// After (SDK v3)
const client = new DynamoDB({
  credentials: {
    accessKeyId: "KEY",
    secretAccessKey: "SECRET",
  },
});
```

Configuration which is not changed

```js
// Before (SDK v2)
const client = new AWS.DynamoDB({
  region: "us-west-2",
});
```

```js
// After (SDK v3)
const client = new DynamoDB({
  region: "us-west-2",
});
```

Configuration which is renamed

```js
// Before (SDK v2)
const client = new AWS.DynamoDB({
  maxRetries: 5,
});
```

```js
// After (SDK v3)
const client = new DynamoDB({
  // The key maxRetries is renamed to maxAttempts.
  // The value of maxAttempts needs to be maxRetries + 1.
  maxAttempts: 5,
});
```

## Global config keys

The transformation of client configuration applies to global config keys

```js
// Before (SDK v2)
import AWS from "aws-sdk";

AWS.config.region = "us-west-2";

const client = new AWS.DynamoDB();
```

```js
// After (SDK v3)
import AWS from "aws-sdk";

import { DynamoDB } from "@aws-sdk/client-dynamodb";

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
AWS.config.region = "us-west-2";

const client = new DynamoDB({
  region: "us-west-2",
});
```

## Global config update call

The transformation of client configuration applies to global config update call

```js
// Before (SDK v2)
import AWS from "aws-sdk";

AWS.config.update({ region: "us-west-2" });

const client = new AWS.DynamoDB();
```

```js
// After (SDK v3)
import AWS from "aws-sdk";

import { DynamoDB } from "@aws-sdk/client-dynamodb";

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
AWS.config.update({ region: "us-west-2" });

const client = new DynamoDB({
  region: "us-west-2",
});
```

## Removal of `.promise()` from API calls

The examples below does not include SDK import and client creation.

<table>
  <tr>
    <th>Name</th>
    <th>Before (SDK v2)</th>
    <th>After (SDK v3)</th>
  </tr>
  <tr>
    <td>await expression</td>
    <td>
<pre lang="javascript">
await client.listTables().promise();
</pre>
    </td>
    <td>
<pre lang="javascript">
await client.listTables();
</pre>
    </td>
  </tr>
  <tr>
    <td>call expression</td>
    <td>
<pre lang="javascript">
client.listTables().promise();
</pre>
    </td>
    <td>
<pre lang="javascript">
client.listTables();
</pre>
    </td>
  </tr>
  <tr>
    <td>member expression</td>
    <td>
<pre lang="javascript">
client.listTables().promise().then(console.log);
</pre>
    </td>
    <td>
<pre lang="javascript">
client.listTables().then(console.log);
</pre>
    </td>
  </tr>
  <tr>
    <td>client as a class member</td>
    <td>
<pre lang="javascript">
this.clientInClass.listTables().promise()
</pre>
    </td>
    <td>
<pre lang="javascript">
this.clientInClass.listTables();
</pre>
    </td>
  </tr>
  <tr>
    <td>client defined as a type (no creation in file)</td>
    <td>
<pre lang="javascript">
export const listTables = async (
  client: AWS.DynamoDB
) => client.listTables().promise();
</pre>
    </td>
    <td>
<pre lang="javascript">
export const listTables = async (
  client: DynamoDB
) => client.listTables();
</pre>
    </td>
  </tr>
  <tr>
    <td>Request stored in identifier</td>
    <td>
<pre lang="javascript">
const listTablesRequest = client.listTables();
const response = await listTablesRequest.promise();
</pre>
    </td>
    <td>
<pre lang="javascript">
const listTablesRequest = client.listTables();
const response = await listTablesRequest;
</pre>
    </td>
  </tr>
</table>

## TypeScript types

<table>
  <tr>
    <th>Name</th>
    <th>Before (SDK v2)</th>
    <th>After (SDK v3)</th>
  </tr>
  <tr>
    <td>Basic Type</td>
    <td>
<pre lang="javascript">
import AWS from "aws-sdk";
const foo: AWS.S3.Tag[] = [];
</pre>
    </td>
    <td>
<pre lang="javascript">
import { Tag } from "@aws-sdk/client-s3";
const foo: Tag[] = [];
</pre>
    </td>
  </tr>
  <tr>
    <td>Input/Output Type</td>
    <td>
<pre lang="javascript">
import AWS from "aws-sdk";
const listTablesInput: AWS.DynamoDB.ListTablesInput = { Limit: 10 };
const listTablesOutput: AWS.DynamoDB.ListTablesOutput = {};
</pre>
    </td>
    <td>
<pre lang="javascript">
import { ListTablesCommandInput, ListTablesCommandOutput } from "@aws-sdk/client-dynamodb";
const listTablesInput: ListTablesCommandInput = { Limit: 10 };
const listTablesOutput: ListTablesCommandOutput = {};
</pre>
    </td>
  </tr>
</table>

## Redundant TypeScript types

The examples include imports wherever v3 requires a import. The redundant import of v2 is removed by codemod.

<table>
  <tr>
    <th>Name</th>
    <th>Before (SDK v2)</th>
    <th>After (SDK v3)</th>
  </tr>
  <tr>
    <td>Native Type (string)</td>
    <td>
<pre lang="javascript">
const stringType: AWS.S3.AccountId = "string";
</pre>
    </td>
    <td>
<pre lang="javascript">
const stringType: string = "string";
</pre>
    </td>
  </tr>
  <tr>
    <td>Native Type (boolean)</td>
    <td>
<pre lang="javascript">
const booleanType: AWS.S3.BucketKeyEnabled = true;
</pre>
    </td>
    <td>
<pre lang="javascript">
const booleanType: boolean = true;
</pre>
    </td>
  </tr>
  <tr>
    <td>Native Type (number)</td>
    <td>
<pre lang="javascript">
const numberType: AWS.S3.ContentLength = 123;
</pre>
    </td>
    <td>
<pre lang="javascript">
const numberType: number = 123;
</pre>
    </td>
  </tr>
  <tr>
    <td>Native Type (Date)</td>
    <td>
<pre lang="javascript">
const dateType: AWS.S3.CreationDate = new Date();
</pre>
    </td>
    <td>
<pre lang="javascript">
const dateType: Date = new Date();
</pre>
    </td>
  </tr>
  <tr>
    <td>Native Type (Uint8Array)</td>
    <td>
<pre lang="javascript">
const blobType: AWS.RDSDataService._Blob = new Uint8Array();
</pre>
    </td>
    <td>
<pre lang="javascript">
const blobType: Uint8Array = new Uint8Array();
</pre>
    </td>
  </tr>
  <tr>
    <td>Array (strings)</td>
    <td>
<pre lang="javascript">
const stringArray: AWS.S3.AllowedHeaders = ["string"];
</pre>
    </td>
    <td>
<pre lang="javascript">
const stringArray: Array<string> = ["string"];
</pre>
    </td>
  </tr>
  <tr>
    <td>Array (boolean)</td>
    <td>
<pre lang="javascript">
const booleanArray: AWS.RDSDataService.BooleanArray = [true, false];
</pre>
    </td>
    <td>
<pre lang="javascript">
const booleanArray: Array<boolean> = [true, false];
</pre>
    </td>
  </tr>
  <tr>
    <td>Array (number)</td>
    <td>
<pre lang="javascript">
const numberArray: AWS.RDSDataService.LongArray = [123, 456];
</pre>
    </td>
    <td>
<pre lang="javascript">
const numberArray: Array<number> = [123, 456];
</pre>
    </td>
  </tr>
  <tr>
    <td>Array (Uint8Array)</td>
    <td>
<pre lang="javascript">
const blobArray: AWS.IoTFleetWise.NetworkFilesList = [
  new Uint8Array()
];
</pre>
    </td>
    <td>
<pre lang="javascript">
const blobArray: Array<Uint8Array> = [
  new Uint8Array()
];
</pre>
    </td>
  </tr>
  <tr>
    <td>Array (enum)</td>
    <td>
<pre lang="javascript">
import AWS from "aws-sdk";
const enumArray: AWS.S3.ChecksumAlgorithmList = ["CRC32"];
</pre>
    </td>
    <td>
<pre lang="javascript">
import { ChecksumAlgorithm } from "@aws-sdk/client-s3";
const enumArray: Array<ChecksumAlgorithm> = ["CRC32"];
</pre>
    </td>
  </tr>
  <tr>
    <td>Array (structure)</td>
    <td>
<pre lang="javascript">
import AWS from "aws-sdk";
const structureArray: AWS.S3.Buckets = [{ Name: "bucketName" }];
</pre>
    </td>
    <td>
<pre lang="javascript">
import { Bucket } from "@aws-sdk/client-s3";
const structureArray: Array<Bucket> = [{ Name: "bucketName" }];
</pre>
    </td>
  </tr>
  <tr>
    <td>Map (string)</td>
    <td>
<pre lang="javascript">
const stringMap: AWS.S3.Metadata = { key: "value" };
</pre>
    </td>
    <td>
<pre lang="javascript">
const stringMap: Record<string, string> = { key: "value" };
</pre>
    </td>
  </tr>
  <tr>
    <td>Map (boolean)</td>
    <td>
<pre lang="javascript">
const booleanMap: AWS.APIGateway.MapOfStringToBoolean = {
  key: true
};
</pre>
    </td>
    <td>
<pre lang="javascript">
const booleanMap: Record<string, boolean> = {
  key: true
};
</pre>
    </td>
  </tr>
  <tr>
    <td>Map (number)</td>
    <td>
<pre lang="javascript">
const numberMap: AWS.SSM.AssociationStatusAggregatedCount = {
  key: 123
};
</pre>
    </td>
    <td>
<pre lang="javascript">
const numberMap: Record<string, number> = {
  key: 123
};
</pre>
    </td>
  </tr>
  <tr>
    <td>Map (structure)</td>
    <td>
<pre lang="javascript">
import AWS from "aws-sdk";
const structureMap: AWS.APIGateway.MapOfMethodSnapshot = {
  key: { apiKeyRequired: true }
};
</pre>
    </td>
    <td>
<pre lang="javascript">
import { MethodSnapshot } from "@aws-sdk/client-api-gateway";
const structureMap: Record<string, MethodSnapshot> = {
  key: { apiKeyRequired: true }
};
</pre>
    </td>
  </tr>
  <tr>
    <td>Nested array (twice)</td>
    <td>
<pre lang="javascript">
const arrayNestedTwice: AWS.SageMakerGeospatial.LinearRing = [
  [1, 2], [3, 4]
];
</pre>
    </td>
    <td>
<pre lang="javascript">
const arrayNestedTwice: Array<Array<number>> = [
  [1, 2], [3, 4]
];
</pre>
    </td>
  </tr>
  <tr>
    <td>Nested array (thrice)</td>
    <td>
<pre lang="javascript">
const arrayNestedThrice: AWS.SageMakerGeospatial.LinearRings = [
  [[1, 2], [3, 4]], [[4, 5], [6, 7]]
];
</pre>
    </td>
    <td>
<pre lang="javascript">
const arrayNestedThrice: Array<Array<Array<number>>> = [
  [[1, 2], [3, 4]], [[4, 5], [6, 7]]
];
</pre>
    </td>
  </tr>
  <tr>
    <td>Nested array (four times)</td>
    <td>
<pre lang="javascript">
const arrayNestedFour: AWS.SageMakerGeospatial.LinearRingsList = [
  [[[1], [2]], [[3], [4]]],
  [[[5], [6]], [[7], [8]]]
];
</pre>
    </td>
    <td>
<pre lang="javascript">
const arrayNestedFour: Array<Array<Array<Array<number>>>> = [
  [[[1], [2]], [[3], [4]]],
  [[[5], [6]], [[7], [8]]]
];
</pre>
    </td>
  </tr>
  <tr>
    <td>Nested Maps</td>
    <td>
<pre lang="javascript">
const mapNestedTwice: AWS.LexModelsV2.ConditionMap = {
  key: stringMap
};
</pre>
    </td>
    <td>
<pre lang="javascript">
const mapNestedTwice: Record<string, Record<string, string>> = {
  key: stringMap
};
</pre>
    </td>
  </tr>
  <tr>
    <td>Nested Maps (structure)</td>
    <td>
<pre lang="javascript">
import AWS from "aws-sdk";
const mapNestedTwiceStruct: AWS.APIGateway.PathToMapOfMethodSnapshot = {
  key: structureMap
};
</pre>
    </td>
    <td>
<pre lang="javascript">
import { MethodSnapshot } from "@aws-sdk/client-api-gateway";
const mapNestedTwiceStruct: Record<string, Record<string, MethodSnapshot>> = {
  key: structureMap
};
</pre>
    </td>
  </tr>
  <tr>
    <td>Map of Arrays</td>
    <td>
<pre lang="javascript">
const mapOfArrays: AWS.NetworkManager.FilterMap = {
  key: ["value"]
};
</pre>
    </td>
    <td>
<pre lang="javascript">
const mapOfArrays: Record<string, Array<string>> = {
  key: ["value"]
};
</pre>
    </td>
  </tr>
  <tr>
    <td>Map of Map of Arrays</td>
    <td>
<pre lang="javascript">
const mapOfMapOfArrays: AWS.AppIntegrations.ObjectConfiguration = {
  key: mapOfArrays
};
</pre>
    </td>
    <td>
<pre lang="javascript">
const mapOfMapOfArrays: Record<string, Record<string, Array<string>>> = {
  key: mapOfArrays
};
</pre>
    </td>
  </tr>
  <tr>
    <td>Map of Array of Maps</td>
    <td>
<pre lang="javascript">
import AWS from "aws-sdk";
const mapOfArrayOfMaps: AWS.DynamoDB.BatchGetResponseMap = {
  key: [{ key: { S:"A" }}]
};
</pre>
    </td>
    <td>
<pre lang="javascript">
import { AttributeValue } from "@aws-sdk/client-dynamodb";
const mapOfArrayOfMaps: Record<string, Array<Record<string, AttributeValue>>> = {
  key: [{ key: { S:"A" }}]
};
</pre>
    </td>
  </tr>
  <tr>
    <td>Map of Array of Arrays</td>
    <td>
<pre lang="javascript">
const mapOfArrayOfArrays: AWS.APIGateway.MapOfKeyUsages = {
  key: [[1], [2]]
};
</pre>
    </td>
    <td>
<pre lang="javascript">
const mapOfArrayOfArrays: Record<string, Array<Array<number>>> = {
  key: [[1], [2]]
};
</pre>
    </td>
  </tr>
  <tr>
    <td>Array of Maps</td>
    <td>
<pre lang="javascript">
const arrayOfMaps: AWS.SSM.InventoryItemEntryList = [stringMap];
</pre>
    </td>
    <td>
<pre lang="javascript">
const arrayOfMaps: Array<Record<string, string>> = [stringMap];
</pre>
    </td>
  </tr>
  <tr>
    <td>Array of Map of Arrays</td>
    <td>
<pre lang="javascript">
const arrayOfMapOfArrays: AWS.SSM.TargetMaps = [mapOfArrays];
</pre>
    </td>
    <td>
<pre lang="javascript">
const arrayOfMapOfArrays: Array<Record<string, Array<string>>> = [mapOfArrays];
</pre>
    </td>
  </tr>
</table>

## Waiters

Transforms `waitFor` calls with specific `waitUntil*` functions

```js
// Before (SDK v2)
import AWS from "aws-sdk";

const client = new AWS.S3();

await client.waitFor("bucketExists", { Bucket }).promise();
```

```js
// After (SDK v3)
import { S3, waitUntilBucketExists } from "@aws-sdk/client-s3";

const client = new S3();

await waitUntilBucketExists(
  {
    client,
    maxWaitTime: 200,
  },
  { Bucket }
);
```

## Credential Providers and Chain

We maintain a list of credential providers in v2, and replace them with ones in v3.
The credential providers have changed from creating new class instances to functions which provide Promise of credentials.

| v2 credentials                  | v3 credentials           |
| ------------------------------- | ------------------------ |
| ChainableTemporaryCredentials   | fromTemporaryCredentials |
| CognitoIdentityCredentials      | fromCognitoIdentity      |
| EC2MetadataCredentials          | fromInstanceMetadata     |
| ECSCredentials                  | fromContainerMetadata    |
| EnvironmentCredentials          | fromEnv                  |
| ProcessCredentials              | fromProcess              |
| RemoteCredentials               | fromContainerMetadata    |
| SharedIniFileCredentials        | fromIni                  |
| SsoCredentials                  | fromSSO                  |
| TokenFileWebIdentityCredentials | fromTokenFile            |
| WebIdentityCredentials          | fromWebToken             |

Example transformation

```js
// Before (SDK v2)
import AWS from "aws-sdk";

new AWS.EnvironmentCredentials("AWS");
```

```js
// After (SDK v3)
import { fromEnv } from "@aws-sdk/credential-providers";

// JS SDK v3 switched credential providers from classes to functions.
// This is the closest approximation from codemod of what your application needs.
// Reference: https://www.npmjs.com/package/@aws-sdk/credential-providers
fromEnv("AWS");
```

## Token Providers and Chain

We maintain a list of token providers in v2, and replace them with ones in v3.
The token providers have changed from creating new class instances to functions which provide Promise of token

| v2 token providers  | v3 token providers |
| ------------------- | ------------------ |
| SSOTokenProvider    | fromSso            |
| StaticTokenProvider | fromStatic         |

Example transformation

```js
// Before (SDK v2)
import AWS from "aws-sdk";

new AWS.SSOTokenProvider(options);
```

```js
// After (SDK v3)
import { fromSso } from "@aws-sdk/token-providers";

// JS SDK v3 switched token providers from classes to functions.
// This is the closest approximation from codemod of what your application needs.
// Reference: https://www.npmjs.com/package/@aws-sdk/token-providers
fromSso(options);
```

## DynamoDB DocumentClient

Applies all client transformations to DynamoDB DocumentClient.

Example transformation

```js
// Before (SDK v2)
import AWS from "aws-sdk";

const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-2" });
const response = await documentClient.scan({ TableName: "TABLE_NAME" }).promise();
```

```js
// After (SDK v3)
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const documentClient = DynamoDBDocument.from(new DynamoDB({ region: "us-west-2" }));
const response = await documentClient.scan({ TableName: "TABLE_NAME" });
```

## S3 getSignedUrl

Example transformation

```js
// Before (SDK v2)
import AWS from "aws-sdk";

const client = new AWS.S3();

const url = client.getSignedUrl("getObject", { Bucket: "bucket", Key: "key" });
```

```js
// After (SDK v3)
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";

const client = new S3();

const url = await getSignedUrl(client, new GetObjectCommand({ Bucket: "bucket", Key: "key" }));
```

## S3 multi-part upload

Example transformation

```js
// Before (SDK v2)
import AWS from "aws-sdk";

const client = new AWS.S3();

await client
  .upload({
    Body: "BODY",
    Bucket: "Bucket",
    ContentType: "ContentType",
    Key: "Key",
  })
  .promise();
```

```js
// After (SDK v3)
import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";

const client = new S3();

await new Upload({
  client,
  params: {
    Body: "BODY",
    Bucket: "Bucket",
    ContentType: "ContentType",
    Key: "Key",
  },
}).done();
```
