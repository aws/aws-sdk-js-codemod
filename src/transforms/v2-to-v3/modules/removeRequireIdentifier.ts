import { Collection, Identifier, JSCodeshift, Literal, VariableDeclarator } from "jscodeshift";

import { STRING_LITERAL_TYPE_LIST } from "../config";
import { getRequireDeclaratorsWithIdentifier } from "./getRequireDeclaratorsWithIdentifier";
import { removeDeclaration } from "./removeDeclaration";

export interface RemoveRequireIdentifierOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireIdentifier = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireIdentifierOptions
) => {
  const requireDeclarators = getRequireDeclaratorsWithIdentifier(j, source, {
    identifierName: localName,
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
        if (init.type !== "CallExpression") return true;

        const callee = init.callee;
        if (!callee) return true;
        if (callee.type !== "Identifier") return true;
        if (callee.name !== "require") return true;

        const args = init.arguments;
        if (!args) return true;
        if (args.length !== 1) return true;
        if (!STRING_LITERAL_TYPE_LIST.includes(args[0].type)) return true;
        if ((args[0] as Literal).value !== sourceValue) return true;

        return false;
      }
    );

    // Remove VariableDeclaration if there are no declarations.
    if (varDeclaration.value.declarations?.length === 0) {
      removeDeclaration(j, source, varDeclaration);
    }
  });
};
