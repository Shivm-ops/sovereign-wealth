import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, Time } from 'lightweight-charts';

export interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

const intervals = [
  { label: '1m', value: '1m', seconds: 60 },
  { label: '5m', value: '5m', seconds: 300 },
  { label: '1h', value: '1h', seconds: 3600 },
  { label: '2h', value: '2h', seconds: 7200 },
  { label: '1D', value: '1D', seconds: 86400 },
];

const generateCandleData = (symbol: string, interval: string): CandleData[] => {
  const data: CandleData[] = [];
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let basePrice = (seed % 400) + 100;

  const selectedInterval = intervals.find(i => i.value === interval) || intervals[4];
  const intervalSeconds = selectedInterval.seconds;

  const count = 200;
  // Start from some time in the past
  let currentTime = Math.floor(Date.now() / 1000) - (count * intervalSeconds);

  for (let i = 0; i < count; i++) {
    const volatility = basePrice * 0.005; // Lower volatility for intraday
    const open = basePrice + (Math.sin(i * 0.15 + seed) * volatility);
    const close = open + (Math.cos(i * 0.15 + seed) * volatility * 1.1);
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    data.push({
      time: currentTime as Time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });
    basePrice = close;
    currentTime += intervalSeconds;
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
  const [interval, setInterval] = useState("1h");

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

    const data = generateCandleData(selectedStock, interval);
    candlestickSeries.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current) {
      const data = generateCandleData(selectedStock, interval);
      seriesRef.current.setData(data);

      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [selectedStock, interval]);

  return (
    <div className="glass rounded-xl p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-semibold text-foreground text-lg">Market Performance ({selectedStock})</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time Market Analytics • {interval}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Interval Selector */}
          <div className="flex gap-1 p-1 bg-muted/20 rounded-lg border border-border/10">
            {intervals.map((i) => (
              <button
                key={i.value}
                onClick={() => setInterval(i.value)}
                className={`px-2.5 py-1 text-[10px] rounded-md font-bold uppercase transition-all duration-300 ${interval === i.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
              >
                {i.label}
              </button>
            ))}
          </div>

          {/* Stock Selector */}
          <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
            {stocks.map((s) => (
              <button
                key={s}
                onClick={() => onSelectStock?.(s)}
                className={`px-4 py-1.5 text-xs rounded-md font-medium transition-all duration-300 ${selectedStock === s
                    ? "bg-primary/80 text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                {s}
              </button>
            ))}
            {!stocks.includes(selectedStock) && (
              <button
                className="px-4 py-1.5 text-xs rounded-md font-medium bg-primary/80 text-primary-foreground shadow-lg"
              >
                {selectedStock}
              </button>
            )}
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[380px] cursor-crosshair" />
    </div>
  );
};

export default CandlestickChart;
