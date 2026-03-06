export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  high52: number;
  low52: number;
  chartData: { time: string; value: number }[];
}

const generateChartData = (basePrice: number, trend: 'up' | 'down' | 'neutral') => {
  const data = [];
  let price = basePrice * 0.9;
  for (let i = 0; i < 30; i++) {
    const change = trend === 'up' ? Math.random() * 4 - 1 : trend === 'down' ? Math.random() * 4 - 3 : Math.random() * 4 - 2;
    price = Math.max(price + change, basePrice * 0.7);
    data.push({ time: `Day ${i + 1}`, value: parseFloat(price.toFixed(2)) });
  }
  if (trend === 'up') data[data.length - 1].value = basePrice;
  return data;
};

export const allStocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: 3.42, changePercent: 1.84, volume: "58.2M", marketCap: "2.95T", high52: 199.62, low52: 143.90, chartData: generateChartData(189.84, 'up') },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, change: 5.67, changePercent: 1.52, volume: "22.1M", marketCap: "2.81T", high52: 384.30, low52: 275.37, chartData: generateChartData(378.91, 'up') },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: 2.15, changePercent: 1.54, volume: "25.8M", marketCap: "1.77T", high52: 153.78, low52: 102.21, chartData: generateChartData(141.80, 'up') },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 153.42, change: -1.23, changePercent: -0.80, volume: "45.6M", marketCap: "1.59T", high52: 161.73, low52: 101.26, chartData: generateChartData(153.42, 'down') },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 495.22, change: 12.88, changePercent: 2.67, volume: "41.3M", marketCap: "1.22T", high52: 505.48, low52: 222.97, chartData: generateChartData(495.22, 'up') },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.42, change: -4.56, changePercent: -1.80, volume: "112.5M", marketCap: "789.5B", high52: 299.29, low52: 152.37, chartData: generateChartData(248.42, 'down') },
  { symbol: "META", name: "Meta Platforms", price: 326.49, change: 8.32, changePercent: 2.61, volume: "18.7M", marketCap: "837.2B", high52: 340.73, low52: 198.05, chartData: generateChartData(326.49, 'up') },
  { symbol: "JPM", name: "JPMorgan Chase", price: 172.96, change: 1.45, changePercent: 0.85, volume: "9.8M", marketCap: "497.8B", high52: 178.04, low52: 127.76, chartData: generateChartData(172.96, 'up') },
  { symbol: "V", name: "Visa Inc.", price: 261.53, change: -0.87, changePercent: -0.33, volume: "6.4M", marketCap: "536.2B", high52: 268.52, low52: 218.66, chartData: generateChartData(261.53, 'neutral') },
  { symbol: "WMT", name: "Walmart Inc.", price: 163.42, change: 0.98, changePercent: 0.60, volume: "7.2M", marketCap: "439.8B", high52: 169.94, low52: 143.03, chartData: generateChartData(163.42, 'neutral') },
  { symbol: "DIS", name: "Walt Disney Co.", price: 91.28, change: -2.14, changePercent: -2.29, volume: "14.1M", marketCap: "167.3B", high52: 123.74, low52: 78.73, chartData: generateChartData(91.28, 'down') },
  { symbol: "NFLX", name: "Netflix Inc.", price: 467.23, change: 9.45, changePercent: 2.06, volume: "5.3M", marketCap: "206.1B", high52: 485.00, low52: 344.73, chartData: generateChartData(467.23, 'up') },
];

export const topGainers = allStocks.filter(s => s.change > 0).sort((a, b) => b.changePercent - a.changePercent);
export const topLosers = allStocks.filter(s => s.change < 0).sort((a, b) => a.changePercent - b.changePercent);
export const trendingStocks = [allStocks[4], allStocks[6], allStocks[0], allStocks[11], allStocks[1]];

export const portfolioData = {
  totalValue: 127843.56,
  dayChange: 1243.89,
  dayChangePercent: 0.98,
  holdings: [
    { symbol: "AAPL", shares: 50, avgCost: 165.20, currentPrice: 189.84 },
    { symbol: "MSFT", shares: 25, avgCost: 310.50, currentPrice: 378.91 },
    { symbol: "NVDA", shares: 30, avgCost: 380.00, currentPrice: 495.22 },
    { symbol: "GOOGL", shares: 40, avgCost: 120.30, currentPrice: 141.80 },
    { symbol: "META", shares: 20, avgCost: 280.00, currentPrice: 326.49 },
  ],
  chartData: [
    { month: "Jul", value: 105000 },
    { month: "Aug", value: 108500 },
    { month: "Sep", value: 103200 },
    { month: "Oct", value: 112800 },
    { month: "Nov", value: 118400 },
    { month: "Dec", value: 121900 },
    { month: "Jan", value: 119500 },
    { month: "Feb", value: 124300 },
    { month: "Mar", value: 127843 },
  ],
};

export const marketIndices = [
  { name: "S&P 500", value: 4567.89, change: 0.82 },
  { name: "NASDAQ", value: 14305.67, change: 1.14 },
  { name: "DOW", value: 35428.42, change: 0.45 },
  { name: "Russell 2000", value: 1987.34, change: -0.23 },
];
