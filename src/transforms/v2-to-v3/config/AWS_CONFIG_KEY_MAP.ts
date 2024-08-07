export interface AwsConfigKeyStatus {
  newKeyName?: string;
  description?: string;
  deprecationMessage?: string;
}

/**
 * Maps the AWS config keys with their equivalent replacement in v3.
 */
export const AWS_CONFIG_KEY_MAP: Record<string, AwsConfigKeyStatus> = {
  apiVersion: {
    deprecationMessage: 'The client uses the "latest" apiVersion.',
  },
  computeChecksums: {
    deprecationMessage: "Applicable commands of S3 will automatically compute the MD5 checksums.",
  },
  convertResponseTypes: {
    deprecationMessage:
      "Not type-safe. It doesn't convert time stamp or base64 binaries from the JSON response.",
  },
  correctClockSkew: {
    deprecationMessage: "The clock skew correction is applied by default.",
  },
  credentials: {},
  credentialProvider: {
    newKeyName: "credentials",
    description: "The credentials in JS SDK v3 accepts providers.",
  },
  customUserAgent: {},
  endpoint: {},
  endpointCacheSize: {},
  endpointDiscoveryEnabled: {},
  hostPrefixEnabled: {
    deprecationMessage: "The hostname prefix is automatically inserted when necessary.",
  },
  logger: {},
  maxRedirects: {
    deprecationMessage:
      "SDK does not follow redirects to avoid unintentional cross-region requests.",
  },
  maxRetries: {
    newKeyName: "maxAttempts",
    description: "The value of maxAttempts needs to be maxRetries + 1.",
  },
  params: {
    deprecationMessage:
      "The object needs to be passed to individual operations where it's intended.",
  },
  paramValidation: {
    deprecationMessage: "The SDK no longer validates input parameters.",
  },
  region: {},
  retryDelayOptions: {
    description: "Reference: https://www.npmjs.com/package/@smithy/util-retry",
    deprecationMessage: "The SDK supports more flexible retry strategies in retryStrategy option.",
  },
  systemClockOffset: {},
  s3BucketEndpoint: {
    newKeyName: "bucketEndpoint",
  },
  s3ForcePathStyle: {
    newKeyName: "forcePathStyle",
  },
  s3UseArnRegion: {
    newKeyName: "useArnRegion",
  },
  s3UsEast1RegionalEndpoint: {
    description: 'S3 client will always use regional endpoint if region is set to "us-east-1".',
    deprecationMessage: 'Set region to "aws-global" to send requests to S3 global endpoint.',
  },
  signatureCache: {
    deprecationMessage: "SDK always caches the hashed signing keys.",
  },
  signatureVersion: {
    deprecationMessage: "SDK v3 only supports signature v4.",
  },
  sslEnabled: {
    newKeyName: "tls",
  },
  stsRegionalEndpoints: {
    description: "STS client will always use regional endpoints if set to a specific region.",
    deprecationMessage: 'Set region to "aws-global" to send requests to STS global endpoint.',
  },
  useAccelerateEndpoint: {},
  useDualstackEndpoint: {},
  useFipsEndpoint: {},
};
