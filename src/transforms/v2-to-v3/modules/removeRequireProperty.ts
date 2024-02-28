import { Collection, Identifier, JSCodeshift, Literal, VariableDeclarator } from "jscodeshift";

import { STRING_LITERAL_TYPE_LIST } from "../config";
import { getRequireDeclaratorsWithProperty } from "./getRequireDeclaratorsWithProperty";
import { removeDeclaration } from "./removeDeclaration";

export interface RemoveRequireObjectPropertyOptions {
  localName: string;
  propertyName: string;
  sourceValue: string;
}

// ToDo: Write generic utility to remove unused modules
// Similar to https://github.com/aws/aws-sdk-js-codemod/pull/781
export const removeRequireProperty = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, propertyName, sourceValue }: RemoveRequireObjectPropertyOptions
) => {
  const requireDeclarators = getRequireDeclaratorsWithProperty(j, source, {
    identifierName: propertyName,
    localName,
    sourceValue,
  });

  requireDeclarators.forEach((varDeclarator) => {
    const varDeclaration = varDeclarator.parentPath.parentPath;

    // Removes variable declarator from the declarations.
    varDeclaration.value.declarations = varDeclaration.value.declarations.filter(
      (declaration: VariableDeclarator | Identifier) => {
        if (declaration.type === "Identifier") return true;

        const id = declaration.id;
        if (id.type !== "Identifier") return true;
        if (id.name !== localName) return true;

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
        if (!STRING_LITERAL_TYPE_LIST.includes(args[0].type)) return true;
        if ((args[0] as Literal).value !== sourceValue) return true;

        const property = init.property;
        if (property.type !== "Identifier") return true;
        if (property.name !== propertyName) return true;

        return false;
      }
    );

    // Remove VariableDeclaration if there are no declarations.
    if (varDeclaration.value.declarations?.length === 0) {
      removeDeclaration(j, source, varDeclaration);
    }
  });
};
