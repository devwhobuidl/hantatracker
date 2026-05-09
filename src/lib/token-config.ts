export const TOKEN_CONFIG = {
  // Replace with your actual Solana token address
  TOKEN_CA: "7x...2tXpgu2DLTsPUf9zFmuZmA4xrYxXKBTpVq9wAM7hzs9y", // Placeholder for actual CA
  BUY_LINK: "https://pump.fun/coin/2tXpgu2DLTsPUf9zFmuZmA4xrYxXKBTpVq9wAM7hzs9y",
  DEX_API_URL: "https://api.dexscreener.com/latest/dex/tokens/2tXpgu2DLTsPUf9zFmuZmA4xrYxXKBTpVq9wAM7hzs9y",
  REFRESH_INTERVAL: 15000,
};

export const formatCurrency = (val: number) => {
  if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
  if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
  return `$${val.toFixed(2)}`;
};

export const formatPrice = (val: number) => {
  if (val < 0.0001) return val.toFixed(8);
  if (val < 1) return val.toFixed(6);
  return val.toFixed(2);
};
