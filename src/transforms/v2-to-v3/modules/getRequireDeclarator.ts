import { Collection, Identifier, JSCodeshift, VariableDeclarator } from "jscodeshift";
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
  const v2RequireCallExpressions = source.find(j.VariableDeclaration).filter(
    (variableDeclaration) =>
      !variableDeclaration.value.declarations.some(
        // @ts-expect-error Type 'JSXIdentifier' is not assignable to type 'Identifier'.
        (declaration: VariableDeclarator | Identifier) => {
          if (declaration.type === "Identifier") return true;

          const init = declaration.init;
          if (!init) return true;
          if (init.type !== "CallExpression") return true;

          const callee = init.callee;
          if (!callee) return true;
          if (callee.type !== "Identifier") return true;
          if (callee.name !== "require") return true;

          const args = init.arguments;
          if (!args) return true;
          if (args.length !== 1) return true;
          if (args[0].type !== "Literal") return true;
          if (args[0].value !== PACKAGE_NAME) return true;

          return false;
        }
      )
  );
  if (v2RequireCallExpressions.size()) {
    return v2RequireCallExpressions;
  }

  const v2RequireProperties = source.find(j.VariableDeclaration).filter(
    (variableDeclaration) =>
      !variableDeclaration.value.declarations.some(
        // @ts-expect-error Type 'JSXIdentifier' is not assignable to type 'Identifier'.
        (declaration: VariableDeclarator | Identifier) => {
          if (declaration.type === "Identifier") return true;

          const init = declaration.init;
          if (!init) return true;
          if (init.type !== "MemberExpression") return true;

          const object = init.object;
          if (object.type !== "CallExpression") return true;

          const callee = object.callee;
          if (callee.type !== "Identifier") return true;
          if (callee.name !== "require") return true;

          const args = object.arguments;
          if (args.length !== 1) return true;
          if (args[0].type !== "Literal") return true;
          if (args[0].value !== PACKAGE_NAME) return true;

          const property = init.property;
          if (property.type !== "Identifier") return true;

          return false;
        }
      )
  );
  if (v2RequireProperties.size()) {
    return v2RequireProperties;
  }
};
