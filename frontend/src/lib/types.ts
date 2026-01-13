export type Portfolio = { id: string; name: string };

export type Summary = {
  portfolio_id: string;
  total_value: number;
  total_cost_basis: number;
  total_unrealized_gain: number;
  total_return_pct: number;
  allocation: { symbol: string; weight: number }[];
};

export type ValueResp = {
  portfolio_id: string;
  total_value: number;
  total_cost_basis: number;
  total_unrealized_gain: number;
  positions: {
    symbol: string;
    quantity: number;
    avg_cost: number;
    price: number;
    market_value: number;
    cost_basis: number;
    unrealized_gain: number;
  }[];
};
