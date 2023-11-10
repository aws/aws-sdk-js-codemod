# aws-sdk-js-codemod

This repository contains a collection of codemod scripts for use with
[JSCodeshift][jscodeshift] that help update [AWS SDK for JavaScript][aws-sdk-js]
APIs.

The `aws-sdk-js-codemod` CLI is a lightweight wrapper over jscodeshift.
It processes `--help`, `--version` and `--transform` options before passing them
downstream.

You can provide names of the custom transforms instead of a local path or url:

     v2-to-v3  Converts AWS SDK for JavaScript APIs in a Javascript/TypeScript
               codebase from version 2 (v2) to version 3 (v3).

Please review the code change thoroughly for required functionality before deploying it to production.
If the transformation is not complete or is incorrect, please report the issue on GitHub.

## Prerequisites

To use aws-sdk-js-codemod, please install [Node.js][install-nodejs].

## Usage

- Optionally execute dry-run for the transform, and print transformed files on stdout:
  ```console
  npx aws-sdk-js-codemod@latest --dry --print -t v2-to-v3 PATH...
  ```
- Run transform, and make changes to files:
  ```console
  npx aws-sdk-js-codemod@latest -t v2-to-v3 PATH...
  ```

## Example

```console
$ cat example.ts
import AWS from "aws-sdk";
const client = new AWS.DynamoDB();
const response = await client.listTables({}).promise();

$ npx aws-sdk-js-codemod@latest -t v2-to-v3 example.ts

$ cat example.ts
import { DynamoDB } from "@aws-sdk/client-dynamodb";
const client = new DynamoDB();
const response = await client.listTables({});
```

For a summary of supported transformations, check [TRANSFORMATIONS.md](TRANSFORMATIONS.md).

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

[aws-sdk-js]: https://aws.amazon.com/sdk-for-javascript/
[install-nodejs]: https://nodejs.dev/learn/how-to-install-nodejs
[jscodeshift]: https://github.com/facebook/jscodeshift
