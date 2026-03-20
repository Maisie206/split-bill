import { useState } from "react";

export const MEMBER_AVATARS = ["🐻","🐱","🦊","🐸","🐰","🐧","🐶","🦄"];

export const CATEGORIES = [
  { id: "food", label: "餐飲", emoji: "🍽️" },
  { id: "transport", label: "交通", emoji: "🚌" },
  { id: "hotel", label: "住宿", emoji: "🏨" },
  { id: "ticket", label: "門票", emoji: "🎫" },
  { id: "shopping", label: "購物", emoji: "🛍️" },
  { id: "other", label: "其他", emoji: "📦" },
];

export function Card({ children, style, delay = 0 }) {
  return (
    <div className="fade" style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      animationDelay: `${delay}ms`, ...style,
    }}>{children}</div>
  );
}

export function Btn({ children, onClick, disabled, ghost, style: s }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "10px 20px", borderRadius: "var(--radius-sm)",
      border: ghost ? "1px solid var(--border)" : "none",
      background: disabled ? "var(--subtle)" : ghost ? "var(--card)" : "var(--accent)",
      color: disabled ? "var(--text-muted)" : ghost ? "var(--text)" : "#fff",
      fontSize: "14px", fontWeight: 600, fontFamily: "var(--font)",
      cursor: disabled ? "default" : "pointer", transition: "opacity 0.15s",
      ...s,
    }}>{children}</button>
  );
}

export function Chip({ children, active, onClick, style: s }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "6px 12px", borderRadius: "20px",
      border: `1.5px solid ${active ? "var(--text)" : "var(--border)"}`,
      background: active ? "var(--text)" : "var(--card)",
      color: active ? "#fff" : "var(--text-muted)",
      fontSize: "13px", fontWeight: 600, fontFamily: "var(--font)",
      cursor: onClick ? "pointer" : "default", transition: "all 0.15s",
      ...s,
    }}>{children}</button>
  );
}

export function Input({ icon, style: extraStyle, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      borderRadius: "var(--radius-sm)",
      border: `1.5px solid ${focused ? "var(--border-focus)" : "var(--border)"}`,
      background: "var(--card)", transition: "border-color 0.15s",
      display: "flex", alignItems: "center",
    }}>
      {icon && <span style={{ paddingLeft: "12px", fontSize: "15px", color: "var(--text-muted)", flexShrink: 0 }}>{icon}</span>}
      <input {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{
          flex: 1, padding: icon ? "10px 12px 10px 8px" : "10px 12px",
          border: "none", background: "transparent",
          fontSize: "15px", fontFamily: "var(--font)", fontWeight: 500,
          color: "var(--text)", width: "100%", ...extraStyle,
        }}
      />
    </div>
  );
}

export function Label({ children }) {
  return (
    <div style={{
      fontSize: "12px", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "8px",
    }}>{children}</div>
  );
}

export function Avatar({ index, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: "var(--subtle)", border: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.5, flexShrink: 0,
    }}>{MEMBER_AVATARS[index % MEMBER_AVATARS.length]}</div>
  );
}
