import { AWSError } from "aws-sdk";

export const isAwsError = (error: unknown): error is AWSError => {
  if (error === undefined) {
    return false
  }
  return error instanceof Error;
}