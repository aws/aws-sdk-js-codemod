import jscodeshift from "jscodeshift";

import { getTypesSource } from "./getTypesSource";

export const getClientReqRespTypesMap = async (
  clientName: string
): Promise<Record<string, string>> => {
  const clientTypesMap = {};

  const j = jscodeshift.withParser("ts");
  const source = getTypesSource(j, clientName);

  source.find(j.ClassDeclaration, { id: { name: clientName } }).forEach((classDeclaration) => {
    const classMethods = j(classDeclaration).find(j.TSDeclareMethod).nodes();

    classMethods.forEach((classMethod) => {
      if (classMethod.key.type !== "Identifier") return;
      if (classMethod.key.name === "constructor") return;
      if (classMethod.key.name.startsWith("waitFor")) return;

      const classMethodKeyName = classMethod.key.name;
      const commandName = classMethodKeyName.charAt(0).toUpperCase() + classMethodKeyName.slice(1);

      if (classMethod.params.length !== 2) return;
      if (classMethod.params[0].type !== "Identifier") return;
      if (classMethod.params[0].name !== "params") return;

      const params = classMethod.params[0];

      if (!params.typeAnnotation) return;
      if (!params.typeAnnotation.typeAnnotation) return;
      if (params.typeAnnotation.typeAnnotation.type !== "TSTypeReference") return;
      const paramsTypeRef = params.typeAnnotation.typeAnnotation;

      if (!paramsTypeRef.typeName) return;
      if (paramsTypeRef.typeName.type !== "TSQualifiedName") return;
      const paramsTypeRefName = paramsTypeRef.typeName;

      if (!paramsTypeRefName.right) return;
      if (paramsTypeRefName.right.type !== "Identifier") return;
      const paramsTypeName = paramsTypeRefName.right;
      const requestTypeName = paramsTypeName.name;

      clientTypesMap[requestTypeName] = `${commandName}CommandInput`;

      if (classMethod.params[1].type !== "Identifier") return;
      if (classMethod.params[1].name !== "callback") return;
      const callback = classMethod.params[1];

      if (!callback.typeAnnotation) return;
      if (!callback.typeAnnotation.typeAnnotation) return;
      if (callback.typeAnnotation.typeAnnotation.type !== "TSFunctionType") return;
      const callbackTypeRef = callback.typeAnnotation.typeAnnotation;

      if (!callbackTypeRef.parameters) return;
      if (callbackTypeRef.parameters.length !== 2) return;
      if (callbackTypeRef.parameters[1].type !== "Identifier") return;
      const responseType = callbackTypeRef.parameters[1];

      if (!responseType.typeAnnotation) return;
      if (responseType.typeAnnotation.type !== "TSTypeAnnotation") return;
      if (!responseType.typeAnnotation.typeAnnotation) return;
      if (responseType.typeAnnotation.typeAnnotation.type !== "TSTypeReference") return;
      const responseTypeRef = responseType.typeAnnotation.typeAnnotation;

      if (!responseTypeRef.typeName) return;
      if (responseTypeRef.typeName.type !== "TSQualifiedName") return;
      const responseTypeRefName = responseTypeRef.typeName;

      if (!responseTypeRefName.right) return;
      if (responseTypeRefName.right.type !== "Identifier") return;
      const responseTypeName = responseTypeRefName.right.name;

      clientTypesMap[responseTypeName] = `${commandName}CommandOutput`;
    });
  });

  return Object.entries(clientTypesMap)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
};
