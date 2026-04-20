'use client';

import { useEffect, useState } from 'react';

interface PriceData {
  symbol: string;
  price: number;
  change: number;
}

export default function PriceMarquee() {
  const [prices, setPrices] = useState<PriceData[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch crypto prices from CoinGecko (free, no API key needed)
        const cryptoResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,cardano,solana,polkadot,dogecoin,avalanche-2,polygon&vs_currencies=usd&include_24hr_change=true'
        );
        const cryptoData = await cryptoResponse.json();

        // Fetch stock prices from Finnhub or Yahoo Finance alternative
        const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];
        
        const cryptoPrices: PriceData[] = [
          { symbol: 'BTC', price: cryptoData.bitcoin?.usd || 0, change: cryptoData.bitcoin?.usd_24h_change || 0 },
          { symbol: 'ETH', price: cryptoData.ethereum?.usd || 0, change: cryptoData.ethereum?.usd_24h_change || 0 },
          { symbol: 'BNB', price: cryptoData.binancecoin?.usd || 0, change: cryptoData.binancecoin?.usd_24h_change || 0 },
          { symbol: 'XRP', price: cryptoData.ripple?.usd || 0, change: cryptoData.ripple?.usd_24h_change || 0 },
          { symbol: 'ADA', price: cryptoData.cardano?.usd || 0, change: cryptoData.cardano?.usd_24h_change || 0 },
          { symbol: 'SOL', price: cryptoData.solana?.usd || 0, change: cryptoData.solana?.usd_24h_change || 0 },
          { symbol: 'DOT', price: cryptoData.polkadot?.usd || 0, change: cryptoData.polkadot?.usd_24h_change || 0 },
          { symbol: 'DOGE', price: cryptoData.dogecoin?.usd || 0, change: cryptoData.dogecoin?.usd_24h_change || 0 },
          { symbol: 'AVAX', price: cryptoData['avalanche-2']?.usd || 0, change: cryptoData['avalanche-2']?.usd_24h_change || 0 },
          { symbol: 'MATIC', price: cryptoData.polygon?.usd || 0, change: cryptoData.polygon?.usd_24h_change || 0 },
        ];

        // Fetch stocks from Yahoo Finance alternative (free)
        const stockPrices: PriceData[] = [];
        for (const symbol of stockSymbols) {
          try {
            const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
            const data = await response.json();
            const quote = data.chart.result[0];
            const currentPrice = quote.meta.regularMarketPrice;
            const previousClose = quote.meta.previousClose;
            const change = ((currentPrice - previousClose) / previousClose) * 100;
            
            stockPrices.push({
              symbol,
              price: currentPrice,
              change
            });
          } catch (error) {
            console.error(`Error fetching ${symbol}:`, error);
          }
        }

        setPrices([...cryptoPrices, ...stockPrices].filter(p => p.price > 0));
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (prices.length === 0) {
    return (
      <div style={{
        width: '100%',
        background: 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '12px 0',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        Loading prices...
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%)',
      padding: '12px 0',
      overflow: 'hidden',
      position: 'relative',
      borderBottom: '1px solid #333'
    }}>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-content {
          display: flex;
          animation: scroll 30s linear infinite;
          width: fit-content;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-content">
        {/* Duplicate the content for seamless loop */}
        {[...prices, ...prices].map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 24px',
              whiteSpace: 'nowrap',
              borderRight: '1px solid #444'
            }}
          >
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '0.5px'
            }}>
              {item.symbol}
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#e0e0e0'
            }}>
              ${item.price.toFixed(2)}
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: item.change >= 0 ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {item.change >= 0 ? '▲' : '▼'}
              {Math.abs(item.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
