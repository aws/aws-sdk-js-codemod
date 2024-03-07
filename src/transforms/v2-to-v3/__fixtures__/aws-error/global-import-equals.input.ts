import AWS = require("aws-sdk");

export const isAwsError = (error: unknown): error is AWS.AWSError => {
  if (error === undefined) {
    return false
  }
  return error instanceof Error;
}