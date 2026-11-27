// NestBudget — shared money maths.
//
// Every page imports its totals from here, and here alone:
// if the overview says $5,214 was spent, the budget planner
// and the expenses page say the same, because all three add
// up the same ledger from data.js.

import { INCOME, CATEGORIES, TRANSACTIONS } from "./data.js";

export function money(n) {
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  const text = abs.toLocaleString("en-GB", {
    minimumFractionDigits: abs % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${sign}$${text}`;
}

export function totalIncome() {
  return INCOME.reduce((sum, row) => sum + row.amount, 0);
}

export function spentByCategory() {
  const spent = new Map(CATEGORIES.map((c) => [c.id, 0]));
  for (const tx of TRANSACTIONS) {
    if (tx.amount < 0) spent.set(tx.category, spent.get(tx.category) - tx.amount);
  }
  return spent;
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

export function state() {
  const income = totalIncome();
  const spent = spentByCategory();
  const totalSpent = [...spent.values()].reduce((a, b) => a + b, 0);
  const plannedSavings = CATEGORIES.find((c) => c.id === "savings").budget;
  return { income, spent, totalSpent, plannedSavings, left: income - totalSpent };
}
