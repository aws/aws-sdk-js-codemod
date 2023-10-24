import { fromStatic } from "@aws-sdk/token-providers";

// JS SDK v3 switched token providers from classes to functions.
// This is the closest approximation from codemod of what your application needs.
// Reference: https://www.npmjs.com/package/@aws-sdk/token-providers
fromStatic(options);