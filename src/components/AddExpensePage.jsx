import { useState } from "react";
import { Btn, Chip, Input, Label, Avatar, MEMBER_AVATARS, CATEGORIES } from "./Primitives";

export default function AddExpensePage({ members, onSave, editing, onCancel }) {
  const [desc, setDesc] = useState(editing?.description || "");
  const [amount, setAmount] = useState(editing?.amount?.toString() || "");
  const [payer, setPayer] = useState(editing?.payerId || members[0]?.id || "");
  const [cat, setCat] = useState(editing?.categoryId || "food");
  const [mode, setMode] = useState(editing?.splitMode || "equal");
  const [among, setAmong] = useState(editing?.splitAmong || members.map((m) => m.id));
  const [custom, setCustom] = useState(editing?.customAmounts || {});
  const toggleAmong = (id) => setAmong((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const amt = parseFloat(amount) || 0;
  const customTotal = Object.values(custom).reduce((s, v) => s + (parseFloat(v) || 0), 0);

  const save = () => {
    if (!desc.trim() || amt <= 0) return;
    if (mode === "custom" && Math.abs(customTotal - amt) > 0.01) {
      alert(`自訂金額加總 $${customTotal} 與總金額 $${amt} 不符！`); return;
    }
    const data = {
      description: desc.trim(), amount: amt, payerId: payer,
      categoryId: cat, splitMode: mode,
      splitAmong: mode === "equal" ? among : [],
      customAmounts: mode === "custom" ? custom : {},
    };
    if (editing?.id) data.id = editing.id;
    onSave(data);
  };

  return (
    <div style={{ padding: "20px 16px" }}>
      <div className="fade"><Label>{editing ? "✏️ 編輯" : "✏️ 新增一筆"}</Label></div>

      <div className="fade" style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px", animationDelay: "40ms" }}>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.emoji} {c.label}</Chip>
        ))}
      </div>

      <div className="fade" style={{ marginBottom: "10px", animationDelay: "80ms" }}>
        <Input icon={CATEGORIES.find((c) => c.id === cat)?.emoji}
          value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="買了什麼？" />
      </div>

      <div className="fade" style={{ marginBottom: "16px", animationDelay: "120ms" }}>
        <Input icon="$" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="0" style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em" }} />
      </div>

      <div className="fade" style={{ marginBottom: "16px", animationDelay: "160ms" }}>
        <Label>💳 誰付的？</Label>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {members.map((m, i) => (
            <Chip key={m.id} active={payer === m.id} onClick={() => setPayer(m.id)}>
              {m.emoji || MEMBER_AVATARS[i % MEMBER_AVATARS.length]} {m.name}
            </Chip>
          ))}
        </div>
      </div>

      <div className="fade" style={{ marginBottom: "14px", animationDelay: "200ms" }}>
        <Label>📐 怎麼分？</Label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[{ id: "equal", label: "均分" }, { id: "custom", label: "自訂金額" }].map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              flex: 1, padding: "10px", borderRadius: "var(--radius-sm)",
              border: `1.5px solid ${mode === m.id ? "var(--text)" : "var(--border)"}`,
              background: mode === m.id ? "var(--text)" : "var(--card)",
              color: mode === m.id ? "#fff" : "var(--text-sec)",
              fontWeight: 700, fontSize: "14px", cursor: "pointer",
              fontFamily: "var(--font)", transition: "all 0.15s",
            }}>{m.label}</button>
          ))}
        </div>
      </div>

      {mode === "equal" && (
        <div className="fade" style={{ marginBottom: "16px", animationDelay: "240ms" }}>
          <Label>
            👋 分攤對象
            {among.length > 0 && amt > 0 && (
              <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0, marginLeft: "6px", color: "var(--text-sec)" }}>
                每人 ${Math.round(amt / among.length)}
              </span>
            )}
          </Label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {members.map((m, i) => (
              <Chip key={m.id} active={among.includes(m.id)} onClick={() => toggleAmong(m.id)}>
                {m.emoji || MEMBER_AVATARS[i % MEMBER_AVATARS.length]} {m.name}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {mode === "custom" && (
        <div className="fade" style={{ marginBottom: "16px", animationDelay: "240ms" }}>
          <Label>
            ✍️ 各自金額
            {amt > 0 && (
              <span style={{
                fontWeight: 500, textTransform: "none", letterSpacing: 0, marginLeft: "6px",
                color: Math.abs(customTotal - amt) > 0.01 ? "var(--negative)" : "var(--positive)",
              }}>${customTotal} / ${amt}</span>
            )}
          </Label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {members.map((m, i) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: "72px" }}>
                  <Avatar emoji={m.emoji} index={i} size={28} />
                  <span style={{ fontSize: "13px", fontWeight: 700 }}>{m.name}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <Input icon="$" type="number" value={custom[m.id] || ""}
                    onChange={(e) => setCustom({ ...custom, [m.id]: e.target.value })} placeholder="0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fade" style={{ display: "flex", gap: "8px", marginTop: "20px", animationDelay: "280ms" }}>
        {editing && <Btn ghost onClick={onCancel} style={{ flex: 1 }}>取消</Btn>}
        <Btn onClick={save} disabled={!desc.trim() || amt <= 0} style={{ flex: 2 }}>
          {editing ? "💾 更新" : "✅ 記下來！"}
        </Btn>
      </div>
    </div>
  );
}
