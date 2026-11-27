// NestBudget — the household's money, as one small data model.
//
// A realistic month for the Miller household: two incomes, a
// mortgage, two kids, one very spoiled dog. Every figure on the
// site comes from this file, so the pages always agree with
// each other.

export const HOUSEHOLD = {
  name: "The Miller Household",
  month: "November 2026",
  members: ["Alex", "Jordan", "Mia (9)", "Noah (6)", "Biscuit the dog"],
};

export const INCOME = [
  { source: "Alex — salary", amount: 4250 },
  { source: "Jordan — salary", amount: 3380 },
  { source: "Freelance design", amount: 420 },
];

// kind: "need" | "want" | "savings" — the 50/30/20 rule buckets.
export const CATEGORIES = [
  { id: "housing", label: "Housing", icon: "⌂", kind: "need", budget: 1650 },
  { id: "groceries", label: "Groceries", icon: "🛒", kind: "need", budget: 820 },
  { id: "utilities", label: "Utilities & bills", icon: "💡", kind: "need", budget: 340 },
  { id: "transport", label: "Transport", icon: "🚗", kind: "need", budget: 390 },
  { id: "health", label: "Health & care", icon: "✚", kind: "need", budget: 260 },
  { id: "dining", label: "Dining out", icon: "🍽", kind: "want", budget: 300 },
  { id: "fun", label: "Fun & streaming", icon: "🎬", kind: "want", budget: 210 },
  { id: "shopping", label: "Shopping", icon: "🛍", kind: "want", budget: 360 },
  { id: "kids", label: "Kids & school", icon: "🎒", kind: "want", budget: 280 },
  { id: "savings", label: "Savings & investing", icon: "🐷", kind: "savings", budget: 900 },
];

// amount is negative for spending, positive for money in.
export const TRANSACTIONS = [
  { day: "Nov 2", label: "Mortgage payment", category: "housing", amount: -1580 },
  { day: "Nov 2", label: "Council tax", category: "housing", amount: -70 },
  { day: "Nov 3", label: "Big weekly shop — GreenMart", category: "groceries", amount: -186.4 },
  { day: "Nov 4", label: "Electricity & gas bill", category: "utilities", amount: -142.75 },
  { day: "Nov 5", label: "Fuel — both cars", category: "transport", amount: -118.2 },
  { day: "Nov 6", label: "Dinner at Osteria Lupo", category: "dining", amount: -86.5 },
  { day: "Nov 7", label: "Pharmacy & vitamins", category: "health", amount: -43.9 },
  { day: "Nov 8", label: "Weekly shop — GreenMart", category: "groceries", amount: -164.1 },
  { day: "Nov 9", label: "Streaming bundle", category: "fun", amount: -27.99 },
  { day: "Nov 10", label: "School trip deposit — Mia", category: "kids", amount: -60 },
  { day: "Nov 11", label: "Train passes", category: "transport", amount: -96 },
  { day: "Nov 12", label: "New winter boots — Noah", category: "shopping", amount: -74.5 },
  { day: "Nov 13", label: "Weekly shop — GreenMart", category: "groceries", amount: -171.85 },
  { day: "Nov 14", label: "Dentist check-up", category: "health", amount: -95 },
  { day: "Nov 15", label: "Broadband & phones", category: "utilities", amount: -88.4 },
  { day: "Nov 16", label: "Cinema night, all four of us", category: "fun", amount: -52 },
  { day: "Nov 17", label: "Weekly shop — GreenMart", category: "groceries", amount: -158.3 },
  { day: "Nov 18", label: "Car insurance", category: "transport", amount: -132.6 },
  { day: "Nov 19", label: "Takeaway Friday", category: "dining", amount: -48.25 },
  { day: "Nov 20", label: "Birthday gift — grandma", category: "shopping", amount: -65 },
  { day: "Nov 21", label: "Piano lessons — Mia", category: "kids", amount: -110 },
  { day: "Nov 22", label: "Weekly shop — GreenMart", category: "groceries", amount: -149.6 },
  { day: "Nov 23", label: "Dog food & vet plan", category: "health", amount: -58.75 },
  { day: "Nov 24", label: "Coffee & lunches out", category: "dining", amount: -39.8 },
];

export const GOALS = [
  { id: "emergency", label: "Emergency fund", target: 12000, saved: 8350, monthly: 350, icon: "🛟" },
  { id: "holiday", label: "Summer in Cornwall", target: 3200, saved: 1940, monthly: 210, icon: "🏖" },
  { id: "car", label: "Next family car", target: 9000, saved: 2700, monthly: 180, icon: "🚙" },
  { id: "kids-future", label: "Kids' future fund", target: 20000, saved: 5600, monthly: 160, icon: "🎓" },
];
