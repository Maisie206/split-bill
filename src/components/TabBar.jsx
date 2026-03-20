export default function TabBar({ active, onChange, count }) {
  const tabs = [
    { id: "expenses", icon: "📒", label: "帳本" },
    { id: "add", icon: "✏️", label: "記一筆" },
    { id: "settle", icon: "💰", label: "結算" },
    { id: "members", icon: "👥", label: "成員" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: "480px",
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
      borderTop: "1px solid var(--border)",
      display: "flex", zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {tabs.map((t) => {
        const a = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            flex: 1, position: "relative",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "2px",
            padding: "10px 0 8px", border: "none",
            background: "transparent",
            cursor: "pointer", fontFamily: "var(--font)",
          }}>
            {a && <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: "24px", height: "2px", borderRadius: "1px",
              background: "var(--text)",
            }} />}
            <span style={{ fontSize: "20px" }}>{t.icon}</span>
            <span style={{
              fontSize: "10px", fontWeight: a ? 700 : 500,
              color: a ? "var(--text)" : "var(--text-muted)",
            }}>{t.label}</span>
            {t.id === "expenses" && count > 0 && (
              <span style={{
                position: "absolute", top: "4px", right: "calc(50% - 18px)",
                background: "var(--text)", color: "#fff",
                fontSize: "9px", fontWeight: 700, borderRadius: "8px",
                padding: "1px 5px", minWidth: "14px", textAlign: "center",
              }}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
