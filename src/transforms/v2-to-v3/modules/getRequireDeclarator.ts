import { Collection, JSCodeshift } from "jscodeshift";
import { PACKAGE_NAME } from "../config";

export interface GetRequireDeclaratorOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const getRequireDeclarator = (
  j: JSCodeshift,
  source: Collection<unknown>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: GetRequireDeclaratorOptions
) => {
  // Temporary fix, will be removed in https://github.com/awslabs/aws-sdk-js-codemod/pull/622
  const v2RequireDeclarations = source.find(j.VariableDeclaration).filter((variableDeclaration) =>
    variableDeclaration.value.declarations.some((declarator) => {
      if (declarator.type !== "VariableDeclarator") return false;
      const init = declarator.init;
      if (!init) return false;
      if (init.type !== "CallExpression") return false;
      const callee = init.callee;
      if (!callee) return false;
      if (callee.type !== "Identifier") return false;
      if (callee.name !== "require") return false;
      const argumentsArray = init.arguments;
      if (!argumentsArray) return false;
      if (argumentsArray.length !== 1) return false;
      const argument = argumentsArray[0];
      if (!argument) return false;
      if (argument.type !== "Literal" && argument.type !== "StringLiteral") return false;
      if (argument.value !== PACKAGE_NAME) return false;
      return true;
    })
  );
  if (v2RequireDeclarations.size()) {
    return v2RequireDeclarations;
  }
};
