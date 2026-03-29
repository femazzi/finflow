export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
}

export interface Month {
  id: string;
  name: string;
  emoji: string;
  color: string;
  earnings: Transaction[];
  expenses: Transaction[];
  investments: Transaction[];
  totals: {
    earnings: number;
    expenses: number;
    investments: number;
    balance: number;
  };
  createdAt: string;
  previousBalance: number;
  previousInvestments: number;
}

export interface FinflowData {
  months: Month[];
  settings: {
    userName: string;
    theme: "dark" | "light";
  };
}

export interface CategoryOption {
  label: string;
  value: string;
  icon?: string;
}
