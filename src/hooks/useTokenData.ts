import { useState, useEffect } from 'react';
import { TOKEN_CONFIG } from '@/lib/token-config';
import { getTokenPrice } from '@/lib/tokenPrice';

export interface TokenData {
  priceUsd: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  fdv: number;
  loading: boolean;
  error: boolean;
}

const DEFAULT_DATA: TokenData = {
  priceUsd: 0.0004300,
  priceChange24h: 12.5,
  volume24h: 2480000,
  liquidity: 842100,
  fdv: 4300000,
  loading: true,
  error: false,
};

export function useTokenData() {
  const [data, setData] = useState<TokenData>(DEFAULT_DATA);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const result = await getTokenPrice();

        if (isMounted) {
          setData({
            ...result,
            loading: false,
            error: false,
          });
        }
      } catch (err) {
        console.error("Failed to fetch token data:", err);
        if (isMounted) {
          setData(prev => ({ ...prev, loading: false, error: true }));
        }
      }
    }

    fetchData();
    const interval = setInterval(fetchData, TOKEN_CONFIG.REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return data;
}
