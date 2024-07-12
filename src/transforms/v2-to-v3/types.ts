import type { Identifier, ThisExpression } from "jscodeshift";

export type ClientMetadataRecord = Record<string, ClientMetadata>;

export interface ClientMetadata {
  v2ClientLocalName: string;
  v3ClientName: string;
  v3ClientPackageName: string;
}

export interface ThisMemberExpression {
  type: "MemberExpression";
  object: ThisExpression;
  property: Identifier;
}

export type ClientIdentifier = Identifier | ThisMemberExpression;
export type ClientIdentifiersRecord = Record<string, ClientIdentifier[]>;
