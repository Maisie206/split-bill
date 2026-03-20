import { useState, useRef, useEffect } from "react";

export default function Header({ name, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name || "");
  const inputRef = useRef(null);

  useEffect(() => { setValue(name || ""); }, [name]);
  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const save = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== name) onSave(trimmed);
    else setValue(name || "");
    setEditing(false);
  };

  return (
    <div className="fade" style={{
      padding: "32px 20px 24px", textAlign: "center",
      borderBottom: "1px solid var(--border)",
      background: "var(--card)",
    }}>
      <div style={{ fontSize: "13px", color: "var(--text-muted)", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "6px" }}>💸 ㄅㄉㄓ女團</div>
      {editing ? (
        <input ref={inputRef} value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setValue(name || ""); setEditing(false); } }}
          maxLength={30}
          style={{
            fontSize: "24px", fontWeight: 800, textAlign: "center",
            fontFamily: "var(--font)", letterSpacing: "-0.02em", color: "var(--text)",
            border: "none", borderBottom: "2px solid var(--accent)",
            background: "transparent", outline: "none", width: "100%",
            padding: "4px 0",
          }}
        />
      ) : (
        <h1 onClick={() => setEditing(true)} style={{
          fontSize: "24px", fontWeight: 800, cursor: "pointer",
          fontFamily: "var(--font)", letterSpacing: "-0.02em", color: "var(--text)",
        }}>{name || "我的旅行"}</h1>
      )}
      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
        {editing ? "按 Enter 儲存" : "點擊修改名稱"}
      </div>
    </div>
  );
}
