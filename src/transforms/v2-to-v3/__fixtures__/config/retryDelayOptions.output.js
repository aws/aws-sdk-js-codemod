const config = {
  // Reference: https://www.npmjs.com/package/@smithy/util-retry
  // The key retryDelayOptions is no longer supported in v3, and can be removed.
  // @deprecated The SDK supports more flexible retry strategies in retryStrategy option.
  retryDelayOptions: { base: 300 }
};