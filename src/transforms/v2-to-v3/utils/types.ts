export type ClientMetadataRecord = Record<string, ClientMetadata>;

export interface ClientMetadata {
  v2ClientLocalName: string;
  v3ClientName: string;
  v3ClientPackageName: string;
}
