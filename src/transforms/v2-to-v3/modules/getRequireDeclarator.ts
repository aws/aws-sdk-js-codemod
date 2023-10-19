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
  options: GetRequireDeclaratorOptions
) => {
  const { v2ClientName, v2GlobalName } = options;

  // Support DynamoDB.DocumentClient
  const v2ClientLocalName = options.v2ClientLocalName.split(".")[0];

  // Temporary fix, will be removed in https://github.com/awslabs/aws-sdk-js-codemod/pull/622
  const v2RequireCallExpressions = source
    .find(j.VariableDeclaration)
    .filter((variableDeclaration) =>
      variableDeclaration.value.declarations.some(
        // @ts-expect-error Type 'JSXIdentifier' is not assignable to type 'Identifier'.
        (declaration: VariableDeclarator | Identifier) => {
          if (declaration.type === "Identifier") return false;

          const id = declaration.id;
          if (id.type === "Identifier") {
            if (![v2GlobalName, v2ClientName, v2ClientLocalName].includes(id.name)) return false;
          }
          if (id.type === "ObjectPattern") {
            if (
              !id.properties.some(
                (property) =>
                  property.type === "Property" &&
                  property.key.type === "Identifier" &&
                  [v2GlobalName, v2ClientName, v2ClientLocalName].includes(property.key.name)
              )
            )
              return false;
          }

          const init = declaration.init;
          if (!init) return false;
          if (init.type !== "CallExpression") return false;

          const callee = init.callee;
          if (!callee) return false;
          if (callee.type !== "Identifier") return false;
          if (callee.name !== "require") return false;

          const args = init.arguments;
          if (!args) return false;
          if (args.length !== 1) return false;
          if (args[0].type !== "Literal") return false;
          if (typeof args[0].value !== "string") return false;
          if (!args[0].value.startsWith(PACKAGE_NAME)) return false;

          return true;
        }
      )
    );
  if (v2RequireCallExpressions.size()) {
    return v2RequireCallExpressions;
  }

  const v2RequireProperties = source.find(j.VariableDeclaration).filter((variableDeclaration) =>
    variableDeclaration.value.declarations.some(
      // @ts-expect-error Type 'JSXIdentifier' is not assignable to type 'Identifier'.
      (declaration: VariableDeclarator | Identifier) => {
        if (declaration.type === "Identifier") return false;

        const init = declaration.init;
        if (!init) return false;
        if (init.type !== "MemberExpression") return false;

        const object = init.object;
        if (object.type !== "CallExpression") return false;

        const callee = object.callee;
        if (callee.type !== "Identifier") return false;
        if (callee.name !== "require") return false;

        const args = object.arguments;
        if (args.length !== 1) return false;
        if (args[0].type !== "Literal") return false;
        if (args[0].value !== PACKAGE_NAME) return false;

        const property = init.property;
        if (property.type !== "Identifier") return false;
        if (![v2GlobalName, v2ClientName, v2ClientLocalName].includes(property.name)) return false;

        return true;
      }
    )
  );
  if (v2RequireProperties.size()) {
    return v2RequireProperties;
  }
};
