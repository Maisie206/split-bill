import { useState } from "react";
import { Card, Btn, Input, Label, Avatar, MEMBER_AVATARS } from "./Primitives";

const EMOJI_OPTIONS = ["🐻","🐱","🦊","🐸","🐰","🐧","🐶","🦄","🐼","🦋","🐝","🐳","🦔","🐨","🐮","🦁"];

export default function MembersPage({ members, onAddMember, onRemoveMember, onUpdateMember }) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState("");

  const add = () => {
    if (!name.trim() || members.length >= 8) return;
    onAddMember(name.trim());
    setName("");
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setEditName(m.name);
    setEditEmoji(m.emoji || MEMBER_AVATARS[members.indexOf(m) % MEMBER_AVATARS.length]);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    onUpdateMember(editingId, { name: editName.trim(), emoji: editEmoji });
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

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
            {editingId === m.id ? (
              <div style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <Avatar emoji={editEmoji} index={i} />
                  <div style={{ flex: 1 }}>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      placeholder="名字..." maxLength={8} />
                  </div>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>選擇頭像</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {EMOJI_OPTIONS.map((e) => (
                      <button key={e} onClick={() => setEditEmoji(e)} style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        border: editEmoji === e ? "2px solid var(--accent)" : "1px solid var(--border)",
                        background: editEmoji === e ? "var(--accent-light)" : "var(--subtle)",
                        fontSize: "18px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}>{e}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <Btn ghost onClick={cancelEdit} style={{ padding: "6px 14px", fontSize: "13px" }}>取消</Btn>
                  <Btn onClick={saveEdit} disabled={!editName.trim()} style={{ padding: "6px 14px", fontSize: "13px" }}>儲存</Btn>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px" }}>
                <Avatar emoji={m.emoji} index={i} />
                <span style={{ flex: 1, fontSize: "15px", fontWeight: 700 }}>{m.name}</span>
                <button onClick={() => startEdit(m)} style={{
                  width: "28px", height: "28px", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)", background: "var(--subtle)",
                  color: "var(--text-muted)", fontSize: "12px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font)",
                }}>✎</button>
                {members.length > 1 && (
                  <button onClick={() => onRemoveMember(m.id)} style={{
                    width: "28px", height: "28px", borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)", background: "var(--subtle)",
                    color: "var(--text-muted)", fontSize: "12px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font)",
                  }}>✕</button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
