import AWS_smithy_client = require("@smithy/smithy-client");
import ServiceException = AWS_smithy_client.ServiceException;

export const isAwsError = (error: unknown): error is ServiceException => {
  if (error === undefined) {
    return false
  }
  return error instanceof Error;
}