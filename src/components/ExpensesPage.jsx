import { Card, Btn, MEMBER_AVATARS, CATEGORIES } from "./Primitives";

export default function ExpensesPage({ expenses, members, onEdit, onDelete, onGoAdd }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const getMember = (id) => members.find((m) => m.id === id);
  const getMemberIdx = (id) => members.findIndex((m) => m.id === id);

  if (!expenses.length) return (
    <div className="fade" style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
      <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>還沒有帳目</div>
      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>開始記錄旅行花費吧！</div>
      <Btn onClick={onGoAdd}>✏️ 記第一筆</Btn>
    </div>
  );

  return (
    <div style={{ padding: "20px 16px" }}>
      <div className="fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <Label>📒 帳本</Label>
        <div style={{
          background: "var(--text)", color: "#fff",
          padding: "4px 12px", borderRadius: "var(--radius-sm)",
          fontSize: "13px", fontWeight: 700,
        }}>共 ${total.toLocaleString()}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {expenses.map((exp, idx) => {
          const c = CATEGORIES.find((c) => c.id === exp.categoryId) || CATEGORIES[5];
          const pi = getMemberIdx(exp.payerId);
          const p = getMember(exp.payerId);
          return (
            <Card key={exp.id} delay={idx * 30}>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "var(--radius-sm)",
                    background: "var(--subtle)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", flexShrink: 0,
                  }}>{c.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "3px" }}>{exp.description}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {MEMBER_AVATARS[pi >= 0 ? pi % MEMBER_AVATARS.length : 0]} {p?.name || "?"} 付 · {exp.splitMode === "equal" ? `${exp.splitAmong?.length || members.length}人均分` : "自訂"}
                    </div>
                  </div>
                  <div style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.02em" }}>${exp.amount.toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginTop: "10px" }}>
                  <button onClick={() => onEdit(exp)} style={{
                    padding: "4px 12px", borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)", background: "var(--card)",
                    color: "var(--text-sec)", fontSize: "12px", fontWeight: 600,
                    cursor: "pointer", fontFamily: "var(--font)",
                  }}>編輯</button>
                  <button onClick={() => onDelete(exp.id)} style={{
                    padding: "4px 12px", borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)", background: "var(--card)",
                    color: "var(--negative)", fontSize: "12px", fontWeight: 600,
                    cursor: "pointer", fontFamily: "var(--font)",
                  }}>刪除</button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontSize: "12px", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "8px",
    }}>{children}</div>
  );
}
