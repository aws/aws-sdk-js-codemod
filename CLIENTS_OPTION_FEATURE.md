# --clients Option Feature

This document describes the new `--clients` option for the `v2-to-v3` transform, which allows selective transformation of specific AWS SDK clients.

## Overview

The `--clients` option enables users to transform only specific AWS SDK clients instead of transforming all clients found in the codebase. This is useful for gradual migration scenarios where you want to migrate clients one at a time.

## Usage

```bash
npx aws-sdk-js-codemod@latest -t v2-to-v3 --clients <client-list> <files>
```

Where `<client-list>` is a comma-separated list of AWS SDK client names (case-insensitive).

## Examples

### Transform only S3 client

**Input:**
```javascript
import AWS from "aws-sdk";

const s3Client = new AWS.S3();
const ddbClient = new AWS.DynamoDB();
const lambdaClient = new AWS.Lambda();
```

**Command:**
```bash
npx aws-sdk-js-codemod@latest -t v2-to-v3 --clients s3 example.js
```

**Output:**
```javascript
import AWS from "aws-sdk";
import { S3 } from '@aws-sdk/client-s3';

const s3Client = new S3();
const ddbClient = new AWS.DynamoDB();  // Unchanged
const lambdaClient = new AWS.Lambda(); // Unchanged
```

### Transform multiple clients

**Command:**
```bash
npx aws-sdk-js-codemod@latest -t v2-to-v3 --clients s3,dynamodb example.js
```

**Output:**
```javascript
import AWS from "aws-sdk";
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { S3 } from '@aws-sdk/client-s3';

const s3Client = new S3();
const ddbClient = new DynamoDB();
const lambdaClient = new AWS.Lambda(); // Unchanged
```

### Transform all clients (default behavior)

**Command:**
```bash
npx aws-sdk-js-codemod@latest -t v2-to-v3 example.js
```

**Output:**
```javascript
import { Lambda } from '@aws-sdk/client-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { S3 } from '@aws-sdk/client-s3';

const s3Client = new S3();
const ddbClient = new DynamoDB();
const lambdaClient = new Lambda();
```

## Features

- **Case-insensitive matching**: `--clients s3` matches `S3`, `s3`, etc.
- **Whitespace handling**: `--clients " s3 , dynamodb "` works correctly
- **Partial transformation**: Only specified clients are transformed, others remain unchanged
- **Backward compatibility**: When no `--clients` option is provided, all clients are transformed (existing behavior)

## Client Names

The client names should match the AWS SDK v2 service names. Common examples:

- `s3` - Amazon S3
- `dynamodb` - Amazon DynamoDB  
- `lambda` - AWS Lambda
- `ec2` - Amazon EC2
- `rds` - Amazon RDS
- `sns` - Amazon SNS
- `sqs` - Amazon SQS
- `cloudformation` - AWS CloudFormation

## Use Cases

1. **Gradual Migration**: Transform one service at a time to reduce risk
2. **Testing**: Transform only the clients you want to test first
3. **Dependency Management**: Transform clients based on your dependency update schedule
4. **Large Codebases**: Avoid transforming all clients at once in large applications

## Implementation Details

The feature works by:

1. Detecting all AWS SDK v2 clients in the code
2. Filtering the detected clients based on the `--clients` option
3. Applying transformations only to the filtered clients
4. Leaving non-specified clients unchanged

The filtering happens before any transformations are applied, ensuring that only the specified clients go through the v2-to-v3 migration process.
