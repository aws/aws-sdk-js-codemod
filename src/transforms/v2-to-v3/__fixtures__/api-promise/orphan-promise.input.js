// client is AWS SDK JS v2 client here, but jscodeshift can't detect it because of lack of types/import.
export const listTables = (client) => client.listTables().promise();