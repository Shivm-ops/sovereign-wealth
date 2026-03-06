import { useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

export interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const generateCandleData = (symbol: string): CandleData[] => {
  const data: CandleData[] = [];
  let basePrice = symbol === "AAPL" ? 182 : symbol === "MSFT" ? 365 : symbol === "NVDA" ? 470 : symbol === "GOOGL" ? 135 : 150;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  
  for (let w = 0; w < 6; w++) {
    for (const day of days) {
      const volatility = basePrice * 0.025;
      const open = basePrice + (Math.random() - 0.48) * volatility;
      const close = open + (Math.random() - 0.45) * volatility * 1.5;
      const high = Math.max(open, close) + Math.random() * volatility * 0.6;
      const low = Math.min(open, close) - Math.random() * volatility * 0.6;
      const volume = Math.floor(20 + Math.random() * 80);

      data.push({
        date: `W${w + 1} ${day}`,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume,
      });
      basePrice = close;
    }
  }
  return data;
};

const stocks = ["AAPL", "MSFT", "NVDA", "GOOGL"];

// Custom candle shape
const CandleShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;

  const { open, close, high, low } = payload;
  const isUp = close >= open;
  const color = isUp ? "hsl(165, 78%, 27%)" : "hsl(0, 72%, 51%)";

  const yScale = props.yScale || ((v: number) => v);
  // We need to compute positions from the chart's y scale
  const yHigh = y;
  const yLow = y + height;
  const range = high - low;
  if (range === 0) return null;

  const candleTop = yHigh + ((high - Math.max(open, close)) / range) * height;
  const candleBottom = yHigh + ((high - Math.min(open, close)) / range) * height;
  const candleHeight = Math.max(candleBottom - candleTop, 1);
  const wickX = x + width / 2;

  return (
    <g>
      {/* Upper wick */}
      <line x1={wickX} y1={yHigh} x2={wickX} y2={candleTop} stroke={color} strokeWidth={1} />
      {/* Lower wick */}
      <line x1={wickX} y1={candleBottom} x2={wickX} y2={yLow} stroke={color} strokeWidth={1} />
      {/* Body */}
      <rect
        x={x + width * 0.15}
        y={candleTop}
        width={width * 0.7}
        height={candleHeight}
        fill={isUp ? color : color}
        fillOpacity={isUp ? 0.2 : 0.8}
        stroke={color}
        strokeWidth={1}
        rx={1}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload as CandleData;
  const isUp = d.close >= d.open;
  return (
    <div className="glass-strong rounded-lg p-3 text-xs space-y-1 min-w-[140px]">
      <p className="font-semibold text-foreground">{d.date}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-muted-foreground">
        <span>Open</span><span className="text-right text-foreground">${d.open.toFixed(2)}</span>
        <span>High</span><span className="text-right text-foreground">${d.high.toFixed(2)}</span>
        <span>Low</span><span className="text-right text-foreground">${d.low.toFixed(2)}</span>
        <span>Close</span>
        <span className={`text-right font-medium ${isUp ? "text-emerald" : "text-destructive"}`}>${d.close.toFixed(2)}</span>
      </div>
    </div>
  );
};

const CandlestickChart = () => {
  const [selected, setSelected] = useState("AAPL");
  const data = generateCandleData(selected);

  // For the composed chart we use high-low as the bar range
  const chartData = data.map((d) => ({
    ...d,
    // Bar from low to high
    range: [d.low, d.high] as [number, number],
  }));

  const minPrice = Math.min(...data.map((d) => d.low)) * 0.998;
  const maxPrice = Math.max(...data.map((d) => d.high)) * 1.002;

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-foreground">Candlestick Chart</h3>
        <div className="flex gap-1">
          {stocks.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                selected === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }}
              interval={4}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }}
              tickFormatter={(v) => `$${v.toFixed(0)}`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="range" shape={<CandleShape />}>
              {chartData.map((entry, i) => (
                <Cell key={i} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CandlestickChart;
