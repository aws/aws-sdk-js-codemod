import * as AWS from 'aws-sdk';

export class SecretsManager {
  constructor(client = new AWS.SecretsManager()) {
    this.client = client;
  }

  async getSecretValue(secretId) {
    const response = await this.client
      .getSecretValue({ SecretId: secretId })
      .promise();
    if (response.SecretString) {
      return response.SecretString;
    } else {
      throw new Error(`Unable to get the secret value from ${secretId}`);
    }
  }
}