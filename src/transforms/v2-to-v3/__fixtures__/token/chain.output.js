import { chain as providerChain } from "@smithy/property-provider";

// JS SDK v3 switched token providers from classes to functions.
// The TokenProviderChain is now a chain of providers.
// Reference: https://www.npmjs.com/package/@aws-sdk/token-providers
providerChain(providers);