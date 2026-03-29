import type { Transaction } from "../types";

// Calcular total de um Array de transações
export const calculateTotal = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
};

// Calcular saldo: ganhos - gastos - investimentos
export const calculateBalance = (
  earnings: number,
  expenses: number,
  investments: number
): number => {
  return earnings - expenses - investments;
};

// Agrupar transações por categoria
export const groupByCategory = (
  transactions: Transaction[]
): Record<string, number> => {
  return transactions.reduce(
    (acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    },
    {} as Record<string, number>
  );
};
