import { chain as providerChain } from "@smithy/property-provider";

// JS SDK v3 switched to credential providers to functions instead of objects.
// The CredentialProviderChain is now a chain of providers.
// Reference: https://www.npmjs.com/package/@aws-sdk/credential-providers
providerChain(providers);