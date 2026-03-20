export function settle(expenses, members) {
  const bal = {};
  members.forEach((m) => (bal[m.id] = 0));
  expenses.forEach((e) => {
    bal[e.payerId] = (bal[e.payerId] || 0) + e.amount;
    if (e.splitMode === "equal") {
      const who = e.splitAmong?.length ? e.splitAmong : members.map((m) => m.id);
      const share = e.amount / who.length;
      who.forEach((id) => (bal[id] = (bal[id] || 0) - share));
    } else {
      Object.entries(e.customAmounts || {}).forEach(([id, a]) => (bal[id] = (bal[id] || 0) - (parseFloat(a) || 0)));
    }
  });
  const debtors = [], creditors = [];
  Object.entries(bal).forEach(([id, b]) => {
    const r = Math.round(b * 100) / 100;
    if (r < -0.01) debtors.push({ id, amount: -r });
    else if (r > 0.01) creditors.push({ id, amount: r });
  });
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);
  const result = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const t = Math.min(debtors[i].amount, creditors[j].amount);
    if (t > 0.01) result.push({ from: debtors[i].id, to: creditors[j].id, amount: Math.round(t) });
    debtors[i].amount -= t;
    creditors[j].amount -= t;
    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }
  return { settlements: result, balances: bal };
}
