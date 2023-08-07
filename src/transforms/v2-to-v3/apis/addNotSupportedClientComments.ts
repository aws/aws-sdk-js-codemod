import { Collection, JSCodeshift } from "jscodeshift";

import { FUNCTION_TYPE_LIST } from "../config";
import { ClientIdentifier } from "../types";
import { getClientApiCallExpression } from "./getClientApiCallExpression";
import { getClientWaiterCallExpression } from "./getClientWaiterCallExpression";
import { getClientWaiterStates } from "./getClientWaiterStates";

export interface CommentsForUnsupportedAPIsOptions {
  clientIdentifiers: ClientIdentifier[];
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const addNotSupportedClientComments = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: CommentsForUnsupportedAPIsOptions
): void => {
  const { clientIdentifiers } = options;

  for (const clientId of clientIdentifiers) {
    const waiterStates = getClientWaiterStates(j, source, options);

    for (const waiterState of waiterStates) {
      source
        .find(j.CallExpression, getClientWaiterCallExpression(clientId, waiterState))
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
      ];
      for (const { apiName, apiDescription, apiSuggestion } of apiMetadata) {
        source
          .find(j.CallExpression, getClientApiCallExpression(clientId, apiName))
          .forEach((callExpression) => {
            const args = callExpression.node.arguments;

            if (FUNCTION_TYPE_LIST.includes(args[args.length - 1].type)) {
              const comments = callExpression.node.comments || [];
              comments.push(
                j.commentLine(
                  ` ${apiDescription} with callbacks are not supported in AWS SDK for JavaScript (v3).`
                )
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
