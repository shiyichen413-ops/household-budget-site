// NestBudget — router, shared money maths, and the Overview page.
//
// The site is a single static page with hash routes:
//   #/          overview      #/budget    budget planner
//   #/expenses  expenses      #/goals     savings goals
// Every page reads the same model from data.js, so the totals
// can never disagree with each other.

import { HOUSEHOLD, INCOME, CATEGORIES, TRANSACTIONS } from "./data.js";
import { money, state, categoryById } from "./lib.js";
import { budgetPage, expensesPage, goalsPage } from "./views.js";

/* ---------- the overview page ---------- */

function overviewPage() {
  const s = state();
  const savingsRate = Math.round((s.plannedSavings / s.income) * 100);
  const spentPct = Math.round((s.totalSpent / s.income) * 100);

  const kindTotals = { need: 0, want: 0, savings: 0 };
  for (const c of CATEGORIES) kindTotals[c.kind] += c.budget;
  const planned = kindTotals.need + kindTotals.want + kindTotals.savings;
  const pct = (n) => Math.round((n / planned) * 100);

  const topCats = [...s.spent.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, amt]) => {
      const c = categoryById(id);
      const width = Math.min(100, Math.round((amt / c.budget) * 100));
      const cls = amt > c.budget ? "over" : width > 85 ? "warn" : "";
      return `<div class="bar-row">
        <span class="cat">${c.icon} ${c.label}</span>
        <span class="bar-track"><span class="bar-fill ${cls}" style="display:block;width:${width}%"></span></span>
        <span class="amt">${money(amt)}</span>
      </div>`;
    })
    .join("");

  const recent = TRANSACTIONS.slice(-6)
    .reverse()
    .map((tx) => {
      const c = categoryById(tx.category);
      return `<tr>
        <td>${tx.day}</td>
        <td>${tx.label}</td>
        <td><span class="pill">${c.label}</span></td>
        <td class="amt">${money(tx.amount)}</td>
      </tr>`;
    })
    .join("");

  return `
  <div class="grid">
    <section class="card span-8">
      <div class="stat-label">Left to spend in ${HOUSEHOLD.month.split(" ")[0]}</div>
      <div class="big-number">${money(s.left)} <small>of ${money(s.income)} income</small></div>
      <p class="hint" style="margin-top:10px">
        ${HOUSEHOLD.members.join(" · ")} — on track: spending is ${spentPct}% of income
        with ${savingsRate}% already set aside for savings.
      </p>
      <div class="split-bar" role="img" aria-label="Planned split of the budget">
        <span class="needs" style="width:${pct(kindTotals.need)}%"></span>
        <span class="wants" style="width:${pct(kindTotals.want)}%"></span>
        <span class="saves" style="width:${pct(kindTotals.savings)}%"></span>
      </div>
      <div class="legend">
        <span><span class="dot needs"></span>Needs <b>${pct(kindTotals.need)}%</b> (guide: 50%)</span>
        <span><span class="dot wants"></span>Wants <b>${pct(kindTotals.want)}%</b> (guide: 30%)</span>
        <span><span class="dot saves"></span>Savings <b>${pct(kindTotals.savings)}%</b> (guide: 20%)</span>
      </div>
    </section>

    <section class="card span-4">
      <div class="stat-label">Income this month</div>
      <div class="big-number">${money(s.income)}</div>
      ${INCOME.map((r) => `<div class="bar-row"><span class="cat">${r.source}</span><span></span><span class="amt">${money(r.amount)}</span></div>`).join("")}
      <p class="hint" style="margin-top:10px">Spent so far <b>${money(s.totalSpent)}</b> · planned savings <b>${money(s.plannedSavings)}</b></p>
    </section>

    <section class="card span-6">
      <h2>Where the money is going</h2>
      <p class="hint">The five biggest categories so far, against their budgets.</p>
      ${topCats}
      <p class="hint" style="margin-top:10px">Full detail lives in the <a href="#/budget">budget planner</a>.</p>
    </section>

    <section class="card span-6">
      <h2>Latest spending</h2>
      <p class="hint">The six most recent entries in the ledger.</p>
      <table class="tx">
        ${recent}
      </table>
      <p class="hint" style="margin-top:10px">Add your own in <a href="#/expenses">expenses</a> — every page updates.</p>
    </section>

    <section class="card span-12 notice">
      <b>House rule:</b> if a category runs over, the money comes out of “Fun &amp; streaming” first —
      never out of savings. This month that rule has not been needed yet.
    </section>
  </div>`;
}

/* ---------- router ---------- */

const ROUTES = {
  dashboard: { render: overviewPage, bind: null },
  budget: { render: budgetPage, bind: null },
  expenses: { render: expensesPage.render, bind: expensesPage.bind },
  goals: { render: goalsPage.render, bind: goalsPage.bind },
};

function currentRoute() {
  const hash = location.hash.replace(/^#\//, "");
  return ROUTES[hash] ? hash : "dashboard";
}

function draw() {
  const name = currentRoute();
  const view = document.getElementById("view");
  view.innerHTML = ROUTES[name].render();
  if (ROUTES[name].bind) ROUTES[name].bind(view);
  for (const a of document.querySelectorAll("#mainnav a")) {
    a.classList.toggle("active", a.dataset.route === name);
  }
}

window.addEventListener("hashchange", draw);
draw();
