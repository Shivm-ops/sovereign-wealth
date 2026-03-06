import { portfolioData } from "@/lib/mockData";

const HoldingsTable = () => (
  <div className="glass rounded-xl p-6">
    <h3 className="font-semibold text-foreground mb-4">Holdings</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground text-xs border-b border-border/30">
            <th className="text-left pb-3 font-medium">Symbol</th>
            <th className="text-right pb-3 font-medium">Shares</th>
            <th className="text-right pb-3 font-medium">Avg Cost</th>
            <th className="text-right pb-3 font-medium">Current</th>
            <th className="text-right pb-3 font-medium">P/L</th>
          </tr>
        </thead>
        <tbody>
          {portfolioData.holdings.map((h) => {
            const pl = (h.currentPrice - h.avgCost) * h.shares;
            const plPercent = ((h.currentPrice - h.avgCost) / h.avgCost) * 100;
            return (
              <tr key={h.symbol} className="border-b border-border/10 last:border-0">
                <td className="py-3 font-semibold text-foreground">{h.symbol}</td>
                <td className="py-3 text-right text-muted-foreground">{h.shares}</td>
                <td className="py-3 text-right text-muted-foreground">${h.avgCost.toFixed(2)}</td>
                <td className="py-3 text-right text-foreground">${h.currentPrice.toFixed(2)}</td>
                <td className={`py-3 text-right font-medium ${pl >= 0 ? "text-emerald" : "text-destructive"}`}>
                  {pl >= 0 ? "+" : ""}${pl.toFixed(0)} ({plPercent.toFixed(1)}%)
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default HoldingsTable;
