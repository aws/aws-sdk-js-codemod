import { SecretsManager } from "@aws-sdk/client-secrets-manager";

export class SecretsManager {
  constructor(client = new SecretsManager()) {
    this.client = client;
  }

  async getSecretValue(secretId) {
    const response = await this.client
      .getSecretValue({ SecretId: secretId });
    if (response.SecretString) {
      return response.SecretString;
    } else {
      throw new Error(`Unable to get the secret value from ${secretId}`);
    }
  }
}