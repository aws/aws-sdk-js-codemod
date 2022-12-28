export type ClientMetadataMap = Record<string, ClientMetadata>;

export interface ClientMetadata {
  v2ClientIdName: string;
  v3ClientName: string;
  v3ClientPackageName: string;
}
