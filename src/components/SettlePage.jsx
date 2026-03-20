import { Card, Avatar, Label } from "./Primitives";
import { settle } from "../lib/settle";

export default function SettlePage({ expenses, members }) {
  const { settlements, balances } = settle(expenses, members);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const getMember = (id) => members.find((m) => m.id === id);
  const getMemberIdx = (id) => members.findIndex((m) => m.id === id);

  if (!expenses.length) return (
    <div className="fade" style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>🧮</div>
      <div style={{ fontSize: "16px", fontWeight: 700 }}>還沒有帳可以結</div>
      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>先去記幾筆吧！</div>
    </div>
  );

  return (
    <div style={{ padding: "20px 16px" }}>
      <Card delay={0}>
        <div style={{ padding: "24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>旅行總花費</div>
          <div style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.03em", marginTop: "4px", color: "var(--text)" }}>
            ${total.toLocaleString()}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            {members.length} 位旅伴 · {expenses.length} 筆消費
          </div>
        </div>
      </Card>

      <div style={{ marginTop: "20px" }}>
        <div className="fade" style={{ animationDelay: "60ms" }}><Label>📊 每人餘額</Label></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {members.map((m, i) => {
            const bal = Math.round(balances[m.id] || 0);
            return (
              <Card key={m.id} delay={100 + i * 30}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px" }}>
                  <Avatar index={i} size={32} />
                  <span style={{ flex: 1, fontSize: "14px", fontWeight: 700 }}>{m.name}</span>
                  <span style={{
                    fontSize: "15px", fontWeight: 800, letterSpacing: "-0.02em",
                    color: bal > 0 ? "var(--positive)" : bal < 0 ? "var(--negative)" : "var(--text-muted)",
                  }}>{bal > 0 ? `+$${bal}` : bal < 0 ? `-$${-bal}` : "$0"}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <div className="fade" style={{ animationDelay: "200ms" }}>
          <Label>🤝 最少轉帳方案{settlements.length > 0 && ` (${settlements.length} 筆)`}</Label>
        </div>
        {!settlements.length ? (
          <Card delay={240}>
            <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: "14px" }}>大家已經結清啦！🎉</div>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {settlements.map((s, i) => {
              const fi = getMemberIdx(s.from), ti = getMemberIdx(s.to);
              const fm = getMember(s.from), tm = getMember(s.to);
              return (
                <Card key={i} delay={240 + i * 40}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Avatar index={fi >= 0 ? fi : 0} size={28} />
                      <span style={{ fontWeight: 700, fontSize: "13px" }}>{fm?.name || "?"}</span>
                    </div>
                    <div style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--text-muted)", fontSize: "12px", gap: "6px",
                    }}>
                      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                      <span>→</span>
                      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Avatar index={ti >= 0 ? ti : 0} size={28} />
                      <span style={{ fontWeight: 700, fontSize: "13px" }}>{tm?.name || "?"}</span>
                    </div>
                    <div style={{
                      marginLeft: "auto", paddingLeft: "10px",
                      fontSize: "17px", fontWeight: 800, letterSpacing: "-0.02em",
                    }}>${s.amount.toLocaleString()}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
