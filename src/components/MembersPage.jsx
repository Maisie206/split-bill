import { useState } from "react";
import { Card, Btn, Input, Label, Avatar } from "./Primitives";

export default function MembersPage({ members, onAddMember, onRemoveMember }) {
  const [name, setName] = useState("");
  const add = () => {
    if (!name.trim() || members.length >= 8) return;
    onAddMember(name.trim());
    setName("");
  };
  return (
    <div style={{ padding: "20px 16px" }}>
      <div className="fade"><Label>👥 旅伴 ({members.length}/8)</Label></div>
      <div className="fade" style={{ display: "flex", gap: "8px", marginBottom: "16px", animationDelay: "40ms" }}>
        <div style={{ flex: 1 }}>
          <Input value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()} placeholder="輸入名字..." maxLength={8} />
        </div>
        <Btn onClick={add} disabled={!name.trim() || members.length >= 8}>加入</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {members.map((m, i) => (
          <Card key={m.id} delay={80 + i * 30}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px" }}>
              <Avatar index={i} />
              <span style={{ flex: 1, fontSize: "15px", fontWeight: 700 }}>{m.name}</span>
              {members.length > 1 && (
                <button onClick={() => onRemoveMember(m.id)} style={{
                  width: "28px", height: "28px", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)", background: "var(--subtle)",
                  color: "var(--text-muted)", fontSize: "12px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font)",
                }}>✕</button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
