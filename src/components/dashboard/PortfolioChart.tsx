import { portfolioData } from "@/lib/mockData";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

const PortfolioChart = () => (
  <div className="glass rounded-xl p-6">
    <div className="flex items-start justify-between mb-6">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
        <p className="text-3xl font-bold text-foreground">${portfolioData.totalValue.toLocaleString()}</p>
        <div className="flex items-center gap-1 text-emerald text-sm mt-1">
          <TrendingUp className="h-3.5 w-3.5" />
          +${portfolioData.dayChange.toLocaleString()} ({portfolioData.dayChangePercent}%) today
        </div>
      </div>
    </div>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={portfolioData.chartData}>
          <defs>
            <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(43, 70%, 52%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(43, 70%, 52%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ backgroundColor: "hsl(220, 18%, 10%)", border: "1px solid hsl(215, 20%, 18%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
          />
          <Area type="monotone" dataKey="value" stroke="hsl(43, 70%, 52%)" strokeWidth={2} fill="url(#portfolioGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PortfolioChart;
