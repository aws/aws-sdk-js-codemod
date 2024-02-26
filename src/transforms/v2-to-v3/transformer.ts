import { API, FileInfo } from "jscodeshift";

import {
  addNotSupportedComments,
  addNotSupportedClientComments,
  removePromiseCalls,
  replaceWaiterApi,
  replaceS3UploadApi,
  replaceS3GetSignedUrlApi,
  getClientIdentifiersRecord,
  replaceAwsIdentity,
} from "./apis";
import { replaceAwsUtilFunctions } from "./aws-util";
import {
  getAwsGlobalConfig,
  replaceAwsConfig,
  replaceClientCreation,
  replaceDocClientCreation,
} from "./client-instances";
import {
  getClientMetadataRecord,
  getClientNamesFromGlobal,
  getClientNamesRecord,
} from "./client-names";
import { S3 } from "./config";
import {
  addClientModules,
  getGlobalNameFromModule,
  getImportType,
  removeClientModule,
  removeGlobalModule,
} from "./modules";
import { removeTypesFromTSQualifiedName, replaceTSTypeReference } from "./ts-type";
import {
  IndentationType,
  getFormattedSourceString,
  getMostUsedIndentationType,
  getMostUsedStringLiteralQuote,
  getValueIndentedWithTabs,
  isTrailingCommaUsed,
  isTypeScriptFile,
} from "./utils";

const transformer = async (file: FileInfo, api: API) => {
  const j = isTypeScriptFile(file.path) ? api.jscodeshift.withParser("ts") : api.jscodeshift;
  const source = j(file.source);
  const importType = getImportType(j, source);

  if (importType === null) {
    return file.source;
  }

  addNotSupportedComments(j, source, importType);

  const v2GlobalName = getGlobalNameFromModule(j, source);
  const v2ClientNamesRecord = getClientNamesRecord(j, source, importType);

  if (v2GlobalName) {
    for (const v2ClientNameFromGlobal of getClientNamesFromGlobal(j, source, v2GlobalName)) {
      if (!(v2ClientNameFromGlobal in v2ClientNamesRecord)) {
        v2ClientNamesRecord[v2ClientNameFromGlobal] = v2ClientNameFromGlobal;
      }
    }
  }

  const clientMetadataRecord = getClientMetadataRecord(v2ClientNamesRecord);
  const clientIdentifiersRecord = getClientIdentifiersRecord(j, source, {
    v2GlobalName,
    v2ClientNamesRecord,
  });

  for (const v2ClientName of Object.keys(clientMetadataRecord)) {
    const clientIdentifiers = clientIdentifiersRecord[v2ClientName];
    addNotSupportedClientComments(j, source, { v2ClientName, clientIdentifiers });
  }

  if (source.toSource() !== file.source) {
    return source.toSource();
  }

  // Compute recast options before doing transformations
  const quote = getMostUsedStringLiteralQuote(j, source);
  const useTabs = getMostUsedIndentationType(file.source) === IndentationType.TAB;
  const trailingComma = isTrailingCommaUsed(j, source);

  const awsGlobalConfig = getAwsGlobalConfig(j, source, v2GlobalName);
  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadataRecord)) {
    const clientIdentifiers = clientIdentifiersRecord[v2ClientName];
    const { v2ClientLocalName, v3ClientName, v3ClientPackageName } = v3ClientMetadata;

    const v2Options = { v2ClientName, v2ClientLocalName, v2GlobalName };
    const v3Options = { v3ClientName, v3ClientPackageName };

    // Remove redundant `Types` from Client Types.
    removeTypesFromTSQualifiedName(j, source, v2ClientName);
    addClientModules(j, source, { ...v2Options, ...v3Options, clientIdentifiers, importType });
    replaceTSTypeReference(j, source, { ...v2Options, v3ClientName });
    removeClientModule(j, source, { ...v2Options, importType });

    if (v2ClientName === S3) {
      // Needs to be called before removing promise calls, as replacement has `.done()` call.
      replaceS3UploadApi(j, source, clientIdentifiers);
    }

    removePromiseCalls(j, source, clientIdentifiers);

    if (v2ClientName === S3) {
      replaceS3GetSignedUrlApi(j, source, clientIdentifiers);
    }

    replaceWaiterApi(j, source, clientIdentifiers);

    replaceClientCreation(j, source, { ...v2Options, v3ClientName, awsGlobalConfig });
    replaceDocClientCreation(j, source, v2Options);
  }
  replaceAwsConfig(j, source, { v2GlobalName, awsGlobalConfig });
  replaceAwsIdentity(j, source, { v2GlobalName, importType });
  replaceAwsUtilFunctions(j, source, v2GlobalName);
  removeGlobalModule(j, source, v2GlobalName);

  const sourceString = getFormattedSourceString(source.toSource({ quote, useTabs, trailingComma }));

  if (useTabs) {
    // Refs: https://github.com/benjamn/recast/issues/315
    return getValueIndentedWithTabs(sourceString);
  }

  return sourceString;
};

export default transformer;

export const parser = "babylon";
