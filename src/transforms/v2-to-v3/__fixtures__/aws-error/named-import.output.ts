import { ServiceException } from "@smithy/smithy-client";

export const isAwsError = (error: unknown): error is ServiceException => {
  if (error === undefined) {
    return false
  }
  return error instanceof Error;
}