import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries } from 'lightweight-charts';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const generateCandleData = (symbol: string): CandleData[] => {
  const data: CandleData[] = [];
  // Use sum of char codes as seed for more consistent but "unique" mock data per symbol
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let basePrice = (seed % 400) + 100;

  const date = new Date(2023, 0, 1);
  for (let i = 0; i < 100; i++) {
    const volatility = basePrice * 0.025;
    const open = basePrice + (Math.sin(i * 0.1 + seed) * volatility * 0.5);
    const close = open + (Math.cos(i * 0.1 + seed) * volatility * 0.8);
    const high = Math.max(open, close) + Math.random() * volatility * 0.4;
    const low = Math.min(open, close) - Math.random() * volatility * 0.4;

    const timeString = date.toISOString().split('T')[0];
    data.push({
      time: timeString,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });
    basePrice = close;
    date.setDate(date.getDate() + 1);
  }
  return data;
};

const stocks = ["AAPL", "MSFT", "NVDA", "GOOGL"];

interface CandlestickChartProps {
  selectedStock?: string;
  onSelectStock?: (symbol: string) => void;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ selectedStock = "AAPL", onSelectStock }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
        fontSize: 10,
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 380,
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignLabels: true,
      },
      crosshair: {
        vertLine: {
          color: 'rgba(255, 255, 255, 0.4)',
          style: 1,
          labelBackgroundColor: '#111827',
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.4)',
          style: 1,
          labelBackgroundColor: '#111827',
        },
      },
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });
    seriesRef.current = candlestickSeries;

    const data = generateCandleData(selectedStock);
    candlestickSeries.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current) {
      const data = generateCandleData(selectedStock);
      seriesRef.current.setData(data);

      // Auto-scroll to most recent data
      if (chartRef.current) {
        chartRef.current.timeScale().scrollToPosition(0, true);
      }
    }
  }, [selectedStock]);

  return (
    <div className="glass rounded-xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-foreground text-lg">Market Performance ({selectedStock})</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time Market Analytics</p>
        </div>
        <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
          {stocks.map((s) => (
            <button
              key={s}
              onClick={() => onSelectStock?.(s)}
              className={`px-4 py-1.5 text-xs rounded-md font-medium transition-all duration-300 ${selectedStock === s
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              {s}
            </button>
          ))}
          {!stocks.includes(selectedStock) && (
            <button
              className="px-4 py-1.5 text-xs rounded-md font-medium bg-primary text-primary-foreground shadow-lg"
            >
              {selectedStock}
            </button>
          )}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[380px] cursor-crosshair" />
    </div>
  );
};

export default CandlestickChart;
