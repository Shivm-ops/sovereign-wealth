import { X, Eye } from "lucide-react";
import { allStocks } from "@/lib/mockData";

interface WatchlistPanelProps {
  watchlistSymbols: string[];
  onRemove: (symbol: string) => void;
}

const WatchlistPanel = ({ watchlistSymbols, onRemove }: WatchlistPanelProps) => {
  const watchlistStocks = allStocks.filter(s => watchlistSymbols.includes(s.symbol));

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">Watchlist</h3>
      </div>
      {watchlistStocks.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No stocks in watchlist. Click + on any stock card to add.</p>
      ) : (
        <div className="space-y-3">
          {watchlistStocks.map((s) => (
            <div key={s.symbol} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
              <div>
                <p className="font-semibold text-sm text-foreground">{s.symbol}</p>
                <p className="text-xs text-muted-foreground">{s.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">${s.price.toFixed(2)}</p>
                  <p className={`text-xs ${s.change >= 0 ? "text-emerald" : "text-destructive"}`}>
                    {s.change >= 0 ? "+" : ""}{s.changePercent.toFixed(2)}%
                  </p>
                </div>
                <button onClick={() => onRemove(s.symbol)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPanel;
