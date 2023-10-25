export interface AwsConfigKeyStatus {
  newKeyName?: string;
  description?: string;
  deprecationMessage?: string;
}

/**
 * Maps the AWS config keys with their equivalent replacement in v3.
 */
export const AWS_CONFIG_KEY_MAP: Record<string, AwsConfigKeyStatus> = {
  computeChecksums: {
    deprecationMessage: "Applicable commands of S3 will automatically compute the MD5 checksums.",
  },
  region: {},
};
