import { ASTPath, CallExpression, MemberExpression } from "jscodeshift";
import { print } from "recast";

export const removePromiseForCallExpression = (callExpression: ASTPath<CallExpression>) => {
  switch (callExpression.parentPath.value.type) {
    case "MemberExpression": {
      callExpression.parentPath.value.object = (
        callExpression.value.callee as MemberExpression
      ).object;
      break;
    }
    case "ArrowFunctionExpression":
    case "AwaitExpression":
    case "ExpressionStatement":
    case "ObjectProperty":
    case "ReturnStatement":
    case "VariableDeclarator": {
      const currentCalleeObject = (callExpression.value.callee as MemberExpression)
        .object as CallExpression;
      if (currentCalleeObject.arguments.length > 0) {
        callExpression.value.arguments = currentCalleeObject.arguments;
      }
      callExpression.value.callee = currentCalleeObject.callee;
      break;
    }
    default:
      throw new Error(
        `Removal of .promise() not implemented for parentPath: ${callExpression.parentPath.value.type}\n` +
          `Code processed: ${print(callExpression.parentPath.node).code}\n\n` +
          "Please report your use case on https://github.com/awslabs/aws-sdk-js-codemod\n"
      );
  }
};
