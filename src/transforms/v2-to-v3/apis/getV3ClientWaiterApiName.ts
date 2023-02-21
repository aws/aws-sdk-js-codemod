export const getV3ClientWaiterApiName = (waiterState: string): string =>
  `waitUntil${waiterState[0].toUpperCase()}${waiterState.slice(1)}`;
