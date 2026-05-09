const TOKEN_CA = "2tXpgu2DLTsPUf9zFmuZmA4xrYxXKBTpVq9wAM7hzs9y"; // ← CHANGE THIS TO YOUR ACTUAL SOLANA TOKEN MINT

interface DexPair {
  chainId: string;
  priceUsd?: string;
  priceChange?: { h24?: number };
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  fdv?: number;
  pairAddress: string;
}

export async function getTokenPrice() {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_CA}`,
      { cache: 'no-store', next: { revalidate: 15 } }
    );

    if (!res.ok) throw new Error('Failed');

    const data = await res.json();
    const pair = data.pairs?.[0] || data.pairs?.find((p: DexPair) => p.chainId === 'solana');

    if (pair) {
      return {
        priceUsd: parseFloat(pair.priceUsd || '0'),
        priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
        volume24h: parseFloat(pair.volume?.h24 || '0'),
        liquidity: parseFloat(pair.liquidity?.usd || '0'),
        fdv: parseFloat(pair.fdv || '0'), // FDV often used as MCAP for new tokens
        pairAddress: pair.pairAddress
      };
    }
  } catch (e) {
    console.error("DexScreener fetch failed, using fallback", e);
  }

  // Fallback dummy data
  return {
    priceUsd: 0.000043,
    priceChange24h: 12.5,
    volume24h: 892000,
    liquidity: 124000,
    fdv: 43200000
  };
}
