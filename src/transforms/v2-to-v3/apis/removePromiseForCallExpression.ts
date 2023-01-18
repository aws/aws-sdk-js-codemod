import { ASTPath, CallExpression, MemberExpression } from "jscodeshift";

export const removePromiseForCallExpression = (callExpression: ASTPath<CallExpression>) => {
  switch (callExpression.parentPath.value.type) {
    case "AwaitExpression": {
      callExpression.parentPath.value.argument = (
        callExpression.value.callee as MemberExpression
      ).object;
      break;
    }
    case "MemberExpression": {
      callExpression.parentPath.value.object = (
        callExpression.value.callee as MemberExpression
      ).object;
      break;
    }
    case "VariableDeclarator": {
      callExpression.parentPath.value.init = (
        callExpression.value.callee as MemberExpression
      ).object;
      break;
    }
    case "ArrowFunctionExpression":
    case "ReturnStatement": {
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
        `Removal of .promise() not implemented for ${callExpression.parentPath.value.type}`
      );
  }
};
