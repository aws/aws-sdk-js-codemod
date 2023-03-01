import { Collection, JSCodeshift } from "jscodeshift";

import { FUNCTION_TYPE_LIST } from "../config";
import { getClientWaiterStates } from "./getClientWaiterStates";
import { getV2ClientIdentifiers } from "./getV2ClientIdentifiers";
import { getV2ClientS3UploadCallExpression } from "./getV2ClientS3UploadCallExpression";
import { getV2ClientWaiterCallExpression } from "./getV2ClientWaiterCallExpression";

export interface CommentsForUnsupportedAPIsOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const addNotSupportedComments = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: CommentsForUnsupportedAPIsOptions
): void => {
  const v2ClientIdentifiers = getV2ClientIdentifiers(j, source, options);

  for (const v2ClientId of v2ClientIdentifiers) {
    const waiterStates = getClientWaiterStates(j, source, options);

    for (const waiterState of waiterStates) {
      source
        .find(j.CallExpression, getV2ClientWaiterCallExpression(v2ClientId, waiterState))
        .forEach((callExpression) => {
          const args = callExpression.node.arguments;

          if (FUNCTION_TYPE_LIST.includes(args[args.length - 1].type)) {
            const comments = callExpression.node.comments || [];
            comments.push(
              j.commentLine(
                " Waiters with callbacks are not supported in AWS SDK for JavaScript (v3)."
              )
            );
            comments.push(
              j.commentLine(
                " Please convert to `await client.waitFor(state, params).promise()`, and re-run aws-sdk-js-codemod."
              )
            );
            callExpression.node.comments = comments;
          }
        });
    }
  }

  if (options.v2ClientName === "S3") {
    for (const v2ClientId of v2ClientIdentifiers) {
      source
        .find(j.CallExpression, getV2ClientS3UploadCallExpression(v2ClientId))
        .forEach((callExpression) => {
          const args = callExpression.node.arguments;

          if (FUNCTION_TYPE_LIST.includes(args[args.length - 1].type)) {
            const comments = callExpression.node.comments || [];
            comments.push(
              j.commentLine(
                " S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3)."
              )
            );
            comments.push(
              j.commentLine(
                " Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod."
              )
            );
            callExpression.node.comments = comments;
          }
        });
    }
  }
};
