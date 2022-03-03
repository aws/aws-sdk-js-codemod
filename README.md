# aws-sdk-js-codemod

This repository contains a collection of codemod scripts for use with
[JSCodeshift][jscodeshift] that help update [AWS SDK for JavaScript][aws-sdk-js]
APIs.

## Prerequisites

To use aws-sdk-js-codemod, please install [Node.js][install-nodejs].

## Usage

- Optionally execute dry-run for the transform, and print transformed files on stdout:
  ```console
  npx aws-sdk-js-codemod --dry --print -t v2-to-v3 PATH...
  ```
- Run transform:
  ```console
  npx aws-sdk-js-codemod -t v2-to-v3 PATH...
  ```

## Example

```console
$ cat example.ts
import AWS from "aws-sdk";

const region = "us-west-2";
const client = new AWS.DynamoDB({ region });
client.listTables({}, (err, data) => {
  if (err) console.log(err, err.stack);
  else console.log(data);
});

$ npx aws-sdk-js-codemod -t v2-to-v3 example.ts

$ cat example.ts
import AWS from "aws-sdk";

import { DynamoDB } from "@aws-sdk/client-dynamodb";

const region = "us-west-2";
const client = new DynamoDB({ region });
client.listTables({}, (err, data) => {
  if (err) console.log(err, err.stack);
  else console.log(data);
});

```

[aws-sdk-js]: https://aws.amazon.com/sdk-for-javascript/
[install-nodejs]: https://nodejs.dev/learn/how-to-install-nodejs
[jscodeshift]: https://github.com/facebook/jscodeshift
