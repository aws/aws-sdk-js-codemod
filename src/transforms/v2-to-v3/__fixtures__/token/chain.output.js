import { chain as providerChain } from "@smithy/property-provider";

// JS SDK v3 switched token providers to functions instead of objects.
// The TokenProviderChain is now a chain of providers.
// Reference: https://www.npmjs.com/package/@aws-sdk/token-providers
providerChain(providers);