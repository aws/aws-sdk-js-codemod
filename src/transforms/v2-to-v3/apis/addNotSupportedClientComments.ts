import { Collection, JSCodeshift } from "jscodeshift";

import { FUNCTION_TYPE_LIST, NOT_SUPPORTED_COMMENT, S3 } from "../config";
import { ClientIdentifier } from "../types";
import { getClientApiCallExpression } from "./getClientApiCallExpression";
import { getClientWaiterCallExpression } from "./getClientWaiterCallExpression";
import { getClientWaiterStates } from "./getClientWaiterStates";

export interface CommentsForUnsupportedAPIsOptions {
  v2ClientName: string;
  clientIdentifiers: ClientIdentifier[];
}

export const addNotSupportedClientComments = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: CommentsForUnsupportedAPIsOptions
): void => {
  const { v2ClientName, clientIdentifiers } = options;

  for (const clientId of clientIdentifiers) {
    const waiterStates = getClientWaiterStates(j, source, clientIdentifiers);

    for (const waiterState of waiterStates) {
      source
        .find(j.CallExpression, getClientWaiterCallExpression(clientId, waiterState))
        .forEach((callExpression) => {
          const args = callExpression.node.arguments;

          if (FUNCTION_TYPE_LIST.includes(args[args.length - 1].type)) {
            const comments = callExpression.node.comments || [];
            comments.push(j.commentLine(` Waiters with callbacks are ${NOT_SUPPORTED_COMMENT}.`));
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

  if (v2ClientName === S3) {
    for (const clientId of clientIdentifiers) {
      const apiMetadata = [
        {
          apiName: "upload",
          apiDescription: "S3 ManagedUpload",
          apiSuggestion: "await client.upload(params, options).promise()",
        },
        {
          apiName: "getSignedUrl",
          apiDescription: "S3 getSignedUrl",
          apiSuggestion: "client.getSignedUrl(apiName, options)",
        },
        {
          apiName: "createPresignedPost",
          apiDescription: "S3 createPresignedPost",
          apiSuggestion: "client.createPresignedPost(params)",
        },
      ];
      for (const { apiName, apiDescription, apiSuggestion } of apiMetadata) {
        source
          .find(j.CallExpression, getClientApiCallExpression(clientId, apiName))
          .forEach((callExpression) => {
            const args = callExpression.node.arguments;

            if (FUNCTION_TYPE_LIST.includes(args[args.length - 1].type)) {
              const comments = callExpression.node.comments || [];
              comments.push(
                j.commentLine(` ${apiDescription} with callbacks is ${NOT_SUPPORTED_COMMENT}.`)
              );
              comments.push(
                j.commentLine(
                  ` Please convert to '${apiSuggestion}', and re-run aws-sdk-js-codemod.`
                )
              );
              callExpression.node.comments = comments;
            }
          });
      }
    }
  }
};
