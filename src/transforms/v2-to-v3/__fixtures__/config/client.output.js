import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  // The key correctClockSkew is no longer supported in v3, and can be removed.
  // @deprecated The clock skew correction is applied by default.
  correctClockSkew: true
});