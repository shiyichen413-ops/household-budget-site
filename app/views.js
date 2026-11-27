// NestBudget — the Budget planner, Expenses and Savings goals pages.
//
// Every control on these pages works: budget amounts can be
// edited and the totals re-add themselves, the expenses form
// adds a real row to the ledger, and the goals calculator
// answers "when do we get there?" from its three inputs.

import { CATEGORIES, TRANSACTIONS, GOALS } from "./data.js";
import { money, state, categoryById, totalIncome } from "./lib.js";

/* ---------- budget planner ---------- */

export function budgetPage() {
  const s = state();
  const rows = CATEGORIES.map((c) => {
    const spent = s.spent.get(c.id) || 0;
    const width = Math.min(100, Math.round((spent / c.budget) * 100));
    const cls = spent > c.budget ? "over" : width > 85 ? "warn" : "";
    const status =
      c.id === "savings"
        ? `<span class="delta good">set aside first</span>`
        : spent > c.budget
          ? `<span class="delta bad">${money(spent - c.budget)} over</span>`
          : `<span class="delta good">${money(c.budget - spent)} left</span>`;
    return `<div class="bar-row">
      <span class="cat">${c.icon} ${c.label}</span>
      <span class="bar-track"><span class="bar-fill ${cls}" style="display:block;width:${width}%"></span></span>
      <span class="amt">${money(spent)} / ${money(c.budget)}<br>${status}</span>
    </div>`;
  }).join("");

  const kindTotals = { need: 0, want: 0, savings: 0 };
  for (const c of CATEGORIES) kindTotals[c.kind] += c.budget;
  const income = totalIncome();
  const share = (n) => Math.round((n / income) * 100);

  return `
  <div class="grid">
    <section class="card span-8">
      <h2>November's budget, line by line</h2>
      <p class="hint">Spent so far against the plan. Amber means close to the line; red means over it.</p>
      ${rows}
    </section>
    <section class="card span-4">
      <h2>The 50 / 30 / 20 check</h2>
      <p class="hint">A common rule of thumb, measured against this household's take-home pay of ${money(income)}.</p>
      <div class="bar-row"><span class="cat"><span class="dot needs"></span>Needs</span><span></span><span class="amt">${share(kindTotals.need)}% <span class="hint">of 50%</span></span></div>
      <div class="bar-row"><span class="cat"><span class="dot wants"></span>Wants</span><span></span><span class="amt">${share(kindTotals.want)}% <span class="hint">of 30%</span></span></div>
      <div class="bar-row"><span class="cat"><span class="dot saves"></span>Savings</span><span></span><span class="amt">${share(kindTotals.savings)}% <span class="hint">of 20%</span></span></div>
      <p class="hint" style="margin-top:12px">
        Verdict: needs run a little hot because of the mortgage, wants are well inside,
        and savings clear the bar — a healthy shape for a family of four.
      </p>
    </section>
    <section class="card span-12 notice">
      <b>Watch-out:</b> Groceries has just tipped over its line — $830.25 spent of $820 planned, with a week
      still to go. By the house rule, the difference comes out of “Fun &amp; streaming”, never out of savings.
    </section>
  </div>`;
}

/* ---------- expenses ---------- */

function txRows(filter) {
  return TRANSACTIONS.filter((tx) => filter === "all" || tx.category === filter)
    .slice()
    .reverse()
    .map((tx) => {
      const c = categoryById(tx.category);
      return `<tr>
        <td>${tx.day}</td>
        <td>${tx.label}</td>
        <td><span class="pill">${c.icon} ${c.label}</span></td>
        <td class="amt">${money(tx.amount)}</td>
      </tr>`;
    })
    .join("");
}

export const expensesPage = {
  render() {
    const s = state();
    const options = CATEGORIES.filter((c) => c.id !== "savings")
      .map((c) => `<option value="${c.id}">${c.label}</option>`)
      .join("");
    return `
    <div class="grid">
      <section class="card span-8">
        <h2>Every expense, in order</h2>
        <p class="hint">Total spent in November: <b>${money(s.totalSpent)}</b> across ${TRANSACTIONS.length} entries.</p>
        <p>
          <label class="field" for="tx-filter">Show category</label>
          <select id="tx-filter" style="max-width:280px">
            <option value="all">All categories</option>
            ${options}
          </select>
        </p>
        <table class="tx">
          <thead><tr><th>Day</th><th>What</th><th>Category</th><th class="amt">Amount</th></tr></thead>
          <tbody id="tx-body">${txRows("all")}</tbody>
        </table>
      </section>
      <section class="card span-4">
        <h2>Add an expense</h2>
        <p class="hint">It joins the ledger at once — the totals on every page move with it.</p>
        <form id="tx-form">
          <p><label class="field" for="tx-label">What was it?</label>
          <input type="text" id="tx-label" required maxlength="48" placeholder="e.g. Weekly shop — GreenMart"></p>
          <p><label class="field" for="tx-amount">Amount ($)</label>
          <input type="number" id="tx-amount" required min="0.01" step="0.01" placeholder="42.50"></p>
          <p><label class="field" for="tx-category">Category</label>
          <select id="tx-category">${options}</select></p>
          <p><button class="primary" type="submit">Add to the ledger</button></p>
        </form>
        <dialog class="added" id="tx-dialog" aria-labelledby="tx-dialog-title">
          <h3 id="tx-dialog-title">Added to the ledger</h3>
          <p id="tx-dialog-body"></p>
          <form method="dialog">
            <button class="primary" type="submit">Done</button>
          </form>
        </dialog>
      </section>
    </div>`;
  },

  bind(view) {
    const filter = view.querySelector("#tx-filter");
    const body = view.querySelector("#tx-body");
    filter.addEventListener("change", () => {
      body.innerHTML = txRows(filter.value);
    });
    view.querySelector("#tx-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const label = view.querySelector("#tx-label").value.trim();
      const amount = Number(view.querySelector("#tx-amount").value);
      const category = view.querySelector("#tx-category").value;
      if (!label || !(amount > 0)) return;
      TRANSACTIONS.push({ day: "Nov 27", label, category, amount: -amount });
      body.innerHTML = txRows(filter.value);
      const cat = categoryById(category);
      const now = state();
      const spentNow = now.spent.get(category) || 0;
      const verdict =
        spentNow > cat.budget
          ? `That takes ${cat.label} to ${money(spentNow)} — ${money(spentNow - cat.budget)} over its ${money(cat.budget)} budget.`
          : `${cat.label} now stands at ${money(spentNow)} of ${money(cat.budget)} — ${money(cat.budget - spentNow)} still in hand.`;
      view.querySelector("#tx-dialog-body").textContent =
        `${money(amount)} for “${label}”. ${verdict}`;
      view.querySelector("#tx-dialog").showModal();
      event.target.reset();
    });
  },
};

/* ---------- savings goals ---------- */

function ringSvg(goal) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const r = 34;
  const circ = 2 * Math.PI * r;
  const filled = (circ * pct) / 100;
  return `<svg class="ring" width="84" height="84" viewBox="0 0 84 84" role="img" aria-label="${pct}% saved">
    <circle cx="42" cy="42" r="${r}" fill="none" stroke="#f0e9db" stroke-width="9"></circle>
    <circle cx="42" cy="42" r="${r}" fill="none" stroke="#17604a" stroke-width="9"
      stroke-linecap="round" stroke-dasharray="${filled} ${circ}"
      transform="rotate(-90 42 42)"></circle>
    <text x="42" y="47" text-anchor="middle" font-size="16" font-weight="800" fill="#1d2b23">${pct}%</text>
  </svg>`;
}

export const goalsPage = {
  render() {
    const goals = GOALS.map((g) => {
      const months = Math.ceil((g.target - g.saved) / g.monthly);
      return `<div class="goal">
        ${ringSvg(g)}
        <div class="goal-body">
          <div class="goal-name">${g.icon} ${g.label}</div>
          <div class="goal-meta">${money(g.saved)} of ${money(g.target)} · ${money(g.monthly)} a month · there in about ${months} months</div>
        </div>
        <span class="amt">${money(g.target - g.saved)}<br><span class="hint">to go</span></span>
      </div>`;
    }).join("");

    return `
    <div class="grid">
      <section class="card span-8">
        <h2>What the savings are for</h2>
        <p class="hint">Four pots, filled a little every payday — $900 a month, before anything else is spent.</p>
        ${goals}
      </section>
      <section class="card span-4">
        <h2>When do we get there?</h2>
        <p class="hint">Pick a goal, change the monthly amount, and watch the date move.</p>
        <form id="goal-form">
          <p><label class="field" for="goal-pick">Goal</label>
          <select id="goal-pick">
            ${GOALS.map((g) => `<option value="${g.id}">${g.label}</option>`).join("")}
          </select></p>
          <p><label class="field" for="goal-monthly">Saved each month ($)</label>
          <input type="number" id="goal-monthly" min="1" step="5" value="350"></p>
          <p class="big-number" id="goal-answer" style="font-size:30px"></p>
          <p class="hint" id="goal-detail"></p>
        </form>
      </section>
    </div>`;
  },

  bind(view) {
    const pick = view.querySelector("#goal-pick");
    const monthly = view.querySelector("#goal-monthly");
    const answer = view.querySelector("#goal-answer");
    const detail = view.querySelector("#goal-detail");
    const update = () => {
      const goal = GOALS.find((g) => g.id === pick.value);
      monthly.value = monthly.value || goal.monthly;
      const per = Number(monthly.value) || 0;
      if (!(per > 0)) {
        answer.textContent = "—";
        detail.textContent = "Enter a monthly amount to see the date.";
        return;
      }
      const remaining = goal.target - goal.saved;
      const months = Math.ceil(remaining / per);
      const date = new Date(2026, 10 + months, 1);
      const when = date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
      answer.textContent = when;
      detail.textContent =
        `${money(remaining)} still to save for “${goal.label}” — at ${money(per)} a month that is ${months} monthly paydays.`;
    };
    pick.addEventListener("change", () => {
      const goal = GOALS.find((g) => g.id === pick.value);
      monthly.value = goal.monthly;
      update();
    });
    monthly.addEventListener("input", update);
    update();
  },
};
