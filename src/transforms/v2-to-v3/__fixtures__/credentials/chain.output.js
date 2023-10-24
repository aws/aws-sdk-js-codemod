import { chain as providerChain } from "@smithy/property-provider";

// JS SDK v3 switched credential providers from classes to functions.
// The CredentialProviderChain is now a chain of providers.
// Reference: https://www.npmjs.com/package/@aws-sdk/credential-providers
providerChain(providers);