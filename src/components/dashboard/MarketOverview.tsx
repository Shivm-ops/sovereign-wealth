import { TrendingUp, TrendingDown } from "lucide-react";
import { marketIndices } from "@/lib/mockData";

const MarketOverview = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {marketIndices.map((idx) => (
      <div key={idx.name} className="glass rounded-xl p-4 hover:border-primary/20 transition-colors">
        <p className="text-xs text-muted-foreground mb-1">{idx.name}</p>
        <p className="text-lg font-bold text-foreground">{idx.value.toLocaleString()}</p>
        <div className={`flex items-center gap-1 text-sm ${idx.change >= 0 ? "text-emerald" : "text-destructive"}`}>
          {idx.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {idx.change >= 0 ? "+" : ""}{idx.change}%
        </div>
      </div>
    ))}
  </div>
);

export default MarketOverview;
