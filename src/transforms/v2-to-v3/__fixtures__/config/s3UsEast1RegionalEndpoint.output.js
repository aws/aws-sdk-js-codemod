const config = {
  // S3 client will always use regional endpoint if region is set to "us-east-1".
  // The key s3UsEast1RegionalEndpoint is no longer supported in v3, and can be removed.
  // @deprecated Set region to "aws-global" to send requests to S3 global endpoint.
  s3UsEast1RegionalEndpoint: "legacy"
};