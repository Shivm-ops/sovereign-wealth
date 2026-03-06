import { TrendingUp, TrendingDown, Plus, Check } from "lucide-react";
import { Stock } from "@/lib/mockData";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StockCardProps {
  stock: Stock;
  inWatchlist?: boolean;
  onToggleWatchlist?: (symbol: string, name: string) => void;
  onClick?: (symbol: string) => void;
}

const StockCard = ({ stock, inWatchlist, onToggleWatchlist, onClick }: StockCardProps) => {
  const isUp = stock.change >= 0;

  return (
    <div
      className="glass rounded-xl p-4 hover:border-primary/20 transition-all duration-300 group cursor-pointer"
      onClick={() => onClick?.(stock.symbol)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{stock.symbol}</span>
            {onToggleWatchlist && (
              <button
                onClick={() => onToggleWatchlist(stock.symbol, stock.name)}
                className={`p-1 rounded-md transition-colors ${inWatchlist ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {inWatchlist ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-foreground">${stock.price.toFixed(2)}</p>
          <div className={`flex items-center gap-0.5 text-xs justify-end ${isUp ? "text-emerald" : "text-destructive"}`}>
            {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isUp ? "+" : ""}{stock.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stock.chartData}>
            <defs>
              <linearGradient id={`grad-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isUp ? "hsl(165, 78%, 27%)" : "hsl(0, 72%, 51%)"} stopOpacity={0.3} />
                <stop offset="100%" stopColor={isUp ? "hsl(165, 78%, 27%)" : "hsl(0, 72%, 51%)"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={isUp ? "hsl(165, 78%, 27%)" : "hsl(0, 72%, 51%)"}
              strokeWidth={1.5}
              fill={`url(#grad-${stock.symbol})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockCard;
