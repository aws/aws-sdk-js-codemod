import {
  ASTPath,
  ArrowFunctionExpression,
  CallExpression,
  Collection,
  FunctionExpression,
  JSCodeshift,
  TryStatement,
} from "jscodeshift";

import { ClientIdentifier } from "../types";

const FUNCTION_EXPRESSION_TYPES = ["ArrowFunctionExpression", "FunctionExpression"];

const renameCodeWithName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  errorName: string
): void => {
  source
    .find(j.MemberExpression, {
      object: { type: "Identifier", name: errorName },
      property: { type: "Identifier", name: "code" },
    })
    .replaceWith(() => j.memberExpression(j.identifier(errorName), j.identifier("name")));
};

const getFirstExpression = (
  j: JSCodeshift,
  callExpression: ASTPath<CallExpression>,
  expressionName: string
): ASTPath<CallExpression> | null => {
  const parentPath = callExpression.parentPath.value;
  if (parentPath?.type !== "MemberExpression") {
    return null;
  }

  const grandParentPath = callExpression.parentPath.parentPath.value;
  if (grandParentPath?.type !== "CallExpression") {
    return null;
  }

  if (parentPath.property.type === "Identifier" && parentPath.property.name === expressionName) {
    return callExpression.parentPath.parentPath;
  }
  return getFirstExpression(j, callExpression.parentPath.parentPath, expressionName);
};

// Renames error.code with error.name.
export const renameErrorCodeWithName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: ClientIdentifier[]
): void => {
  for (const clientId of clientIdentifiers) {
    const callExpressions = source.find(j.CallExpression, {
      callee: { type: "MemberExpression", object: clientId },
    });

    // Replace error.code with error.name in try-catch clauses.
    callExpressions.forEach((callExpression) => {
      const tryStatement = j(callExpression).closest(j.TryStatement).nodes()[0] as TryStatement;

      if (!tryStatement || !tryStatement.handler) {
        return;
      }

      const catchClause = tryStatement.handler;
      const errorParam = catchClause.param;

      if (errorParam?.type !== "Identifier") {
        return;
      }

      renameCodeWithName(j, j(catchClause.body), errorParam.name);
    });

    // Replace error.code with error.name in promise catch.
    callExpressions
      .map((callExpression) => getFirstExpression(j, callExpression, "catch"))
      .forEach((catchExpression) => {
        if (!catchExpression) {
          return;
        }

        if (!FUNCTION_EXPRESSION_TYPES.includes(catchExpression.value.arguments[0].type)) {
          return;
        }

        const catchFunction = catchExpression.value.arguments[0] as
          | FunctionExpression
          | ArrowFunctionExpression;
        const errorParam = catchFunction.params[0];

        if (errorParam?.type !== "Identifier") {
          return;
        }

        renameCodeWithName(j, j(catchFunction.body), errorParam.name);
      });

    // Replace error.code with error.name in promise failure callback.
    callExpressions
      .map((callExpression) => getFirstExpression(j, callExpression, "then"))
      .forEach((thenExpression) => {
        if (!thenExpression) {
          return;
        }

        if (thenExpression.value.arguments.length !== 2) {
          return;
        }

        if (
          !FUNCTION_EXPRESSION_TYPES.includes(thenExpression.value.arguments[0].type) ||
          !FUNCTION_EXPRESSION_TYPES.includes(thenExpression.value.arguments[1].type)
        ) {
          return;
        }

        const failureCallbackFunction = thenExpression.value.arguments[1] as
          | FunctionExpression
          | ArrowFunctionExpression;
        const errorParam = failureCallbackFunction.params[0];

        if (errorParam?.type !== "Identifier") {
          return;
        }

        renameCodeWithName(j, j(failureCallbackFunction.body), errorParam.name);
      });

    // Replace error.code with error.name in callbacks.
    callExpressions.forEach((callExpression) => {
      if (callExpression.value.arguments.length !== 2) {
        return;
      }

      if (!FUNCTION_EXPRESSION_TYPES.includes(callExpression.value.arguments[1].type)) {
        return;
      }

      const callbackFunction = callExpression.value.arguments[1] as
        | FunctionExpression
        | ArrowFunctionExpression;
      const errorParam = callbackFunction.params[0];

      if (errorParam?.type !== "Identifier") {
        return;
      }

      renameCodeWithName(j, j(callbackFunction.body), errorParam.name);
    });
  }
};
