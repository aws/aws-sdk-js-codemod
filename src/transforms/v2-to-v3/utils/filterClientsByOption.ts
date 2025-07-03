/**
 * Filters client names based on the --clients option
 * @param v2ClientNamesRecord - Record of v2 client names
 * @param clientsOption - Comma-separated string of client names to include
 * @returns Filtered record containing only specified clients
 */
export const filterClientsByOption = (
  v2ClientNamesRecord: Record<string, string>,
  clientsOption?: string
): Record<string, string> => {
  if (!clientsOption) {
    return v2ClientNamesRecord;
  }

  const allowedClients = clientsOption
    .split(',')
    .map(client => client.trim().toLowerCase())
    .filter(client => client.length > 0);

  if (allowedClients.length === 0) {
    return v2ClientNamesRecord;
  }

  const filteredRecord: Record<string, string> = {};

  for (const [v2ClientName, v2ClientLocalName] of Object.entries(v2ClientNamesRecord)) {
    // Check if the client name (case-insensitive) is in the allowed list
    if (allowedClients.includes(v2ClientName.toLowerCase())) {
      filteredRecord[v2ClientName] = v2ClientLocalName;
    }
  }

  return filteredRecord;
};
