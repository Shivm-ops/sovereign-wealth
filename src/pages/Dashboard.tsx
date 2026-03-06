import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, LogOut, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import MarketOverview from "@/components/dashboard/MarketOverview";
import StockCard from "@/components/dashboard/StockCard";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import HoldingsTable from "@/components/dashboard/HoldingsTable";
import WatchlistPanel from "@/components/dashboard/WatchlistPanel";
import CandlestickChart from "@/components/dashboard/CandlestickChart";
import { allStocks, topGainers, topLosers, trendingStocks } from "@/lib/mockData";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [profileName, setProfileName] = useState("");
  const [selectedStock, setSelectedStock] = useState("AAPL");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    setProfileName(user.name || user.email || "Investor");

    // Load real watchlist from MongoDB
    const userId = user._id || user.id;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    fetch(`${API_URL}/api/watchlist?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWatchlist(data.map((item: any) => item.symbol));
        }
      })
      .catch(err => console.error("Failed to fetch watchlist", err));
  }, [user]);

  const toggleWatchlist = async (symbol: string, name: string) => {
    if (!user) return;
    const userId = user._id || user.id;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    if (watchlist.includes(symbol)) {
      // Remove from backend
      try {
        const res = await fetch(`${API_URL}/api/watchlist?userId=${userId}&symbol=${symbol}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setWatchlist(prev => prev.filter(s => s !== symbol));
          toast({ title: `${symbol} removed from watchlist` });
        }
      } catch (err) {
        toast({ title: "Error", description: "Failed to remove from watchlist", variant: "destructive" });
      }
    } else {
      // Add to backend
      try {
        const res = await fetch(`${API_URL}/api/watchlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, symbol, name })
        });
        if (res.ok) {
          setWatchlist(prev => [...prev, symbol]);
          toast({ title: `${symbol} added to watchlist` });
        }
      } catch (err) {
        toast({ title: "Error", description: "Failed to add to watchlist", variant: "destructive" });
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-lg">StockSphere</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{profileName || user?.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground gap-1.5">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="px-4 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
        {/* Market Overview */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Market Overview</h2>
          <MarketOverview />
        </div>

        {/* Candlestick Chart */}
        <CandlestickChart selectedStock={selectedStock} onSelectStock={setSelectedStock} />

        {/* Portfolio + Watchlist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PortfolioChart />
            <HoldingsTable />
          </div>
          <WatchlistPanel watchlistSymbols={watchlist} onRemove={(s) => toggleWatchlist(s, "")} />
        </div>

        {/* Top Gainers */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gradient-emerald">Top Gainers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topGainers.slice(0, 4).map(s => (
              <StockCard key={s.symbol} stock={s} inWatchlist={watchlist.includes(s.symbol)} onToggleWatchlist={toggleWatchlist} onClick={setSelectedStock} />
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-destructive">Top Losers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topLosers.slice(0, 4).map(s => (
              <StockCard key={s.symbol} stock={s} inWatchlist={watchlist.includes(s.symbol)} onToggleWatchlist={toggleWatchlist} onClick={setSelectedStock} />
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gradient-gold">Trending Stocks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {trendingStocks.map(s => (
              <StockCard key={s.symbol} stock={s} inWatchlist={watchlist.includes(s.symbol)} onToggleWatchlist={toggleWatchlist} onClick={setSelectedStock} />
            ))}
          </div>
        </div>

        {/* All Stocks */}
        <div>
          <h2 className="text-lg font-semibold mb-3">All Stocks</h2>
          <div className="glass rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border/30">
                  <th className="text-left p-4 font-medium">Symbol</th>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-right p-4 font-medium">Price</th>
                  <th className="text-right p-4 font-medium">Change</th>
                  <th className="text-right p-4 font-medium">Volume</th>
                  <th className="text-right p-4 font-medium">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {allStocks.map(s => (
                  <tr key={s.symbol} onClick={() => setSelectedStock(s.symbol)} className="border-b border-border/10 hover:bg-muted/20 transition-colors cursor-pointer">
                    <td className="p-4 font-semibold text-foreground">{s.symbol}</td>
                    <td className="p-4 text-muted-foreground">{s.name}</td>
                    <td className="p-4 text-right font-medium text-foreground">${s.price.toFixed(2)}</td>
                    <td className={`p-4 text-right font-medium ${s.change >= 0 ? "text-emerald" : "text-destructive"}`}>
                      {s.change >= 0 ? "+" : ""}{s.changePercent.toFixed(2)}%
                    </td>
                    <td className="p-4 text-right text-muted-foreground">{s.volume}</td>
                    <td className="p-4 text-right text-muted-foreground">{s.marketCap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
