// client is AWS SDK JS v2 client here, but jscodeshift can't detect it because of lack of types/import.
export const listTables = (client) =>
  // The `.promise()` call might be on an JS SDK v2 client API.
  // If yes, please remove .promise(). If not, remove this comment.
  client.listTables().promise();