import { emitWarning } from "process";
import { ASTPath, CallExpression, JSCodeshift, MemberExpression } from "jscodeshift";

export const removePromiseForCallExpression = (
  j: JSCodeshift,
  callExpression: ASTPath<CallExpression>
) => {
  const parentPathValue = Array.isArray(callExpression.parentPath.value)
    ? callExpression.parentPath.value[0]
    : callExpression.parentPath.value;
  switch (parentPathValue.type) {
    case "MemberExpression": {
      callExpression.parentPath.value.object = (
        callExpression.value.callee as MemberExpression
      ).object;
      break;
    }
    case "ArrowFunctionExpression":
    case "AwaitExpression":
    case "CallExpression":
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
    default: {
      emitWarning(
        `Removal of .promise() not implemented for parentPath: ${callExpression.parentPath.value.type}\n` +
          `Code processed: ${j(callExpression.parentPath).toSource()}\n\n` +
          "Please report your use case on https://github.com/aws/aws-sdk-js-codemod\n"
      );
      const comments = callExpression.parentPath.node.comments || [];
      comments.push(
        j.commentLine(
          " The promise() call was removed by aws-sdk-js-codemod v2-to-v3 transform using best guess."
        )
      );
      comments.push(
        j.commentLine(
          " Please check that it is correct, and create an issue on GitHub to report this use case."
        )
      );
      callExpression.parentPath.node.comments = comments;
      break;
    }
  }
};
