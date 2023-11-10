const credsAfter = {
  logger: console,
  region: "us-east-1",

  credentials: {
    accessKeyId: "KEY",
    secretAccessKey: "SECRET"
  }
};

const credsBefore = {
  credentials: {
    accessKeyId: "KEY",
    secretAccessKey: "SECRET"
  },

  logger: console,
  region: "us-east-1"
};

const credsInBetween = {
  logger: console,

  credentials: {
    accessKeyId: "KEY",
    secretAccessKey: "SECRET"
  },

  region: "us-east-1"
};

const credsDispersedBefore = {
  credentials: {
    accessKeyId: "KEY",
    secretAccessKey: "SECRET"
  },

  logger: console,
  region: "us-east-1"
};

const credsDispersedAfter = {
  logger: console,

  credentials: {
    accessKeyId: "KEY",
    secretAccessKey: "SECRET"
  },

  region: "us-east-1"
};