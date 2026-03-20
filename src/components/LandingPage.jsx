import { useState } from "react";
import { Card, Btn, Input, Label } from "./Primitives";

export default function LandingPage({ onCreateTrip, onJoinTrip, error }) {
  const [tripName, setTripName] = useState("");
  const [joinId, setJoinId] = useState("");
  const [mode, setMode] = useState("create"); // "create" | "join"

  return (
    <div style={{
      maxWidth: "480px", margin: "0 auto", minHeight: "100vh",
      background: "var(--bg)", fontFamily: "var(--font)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "20px 16px",
    }}>
      <div className="fade" style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>💸</div>
        <h1 style={{
          fontSize: "28px", fontWeight: 800, fontFamily: "var(--font)",
          letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "8px",
        }}>ㄅㄉㄓ女團</h1>
        <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>多人即時分帳工具</div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", width: "100%", maxWidth: "320px" }}>
        {[{ id: "create", label: "建立帳本" }, { id: "join", label: "加入帳本" }].map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)} className="fade" style={{
            flex: 1, padding: "10px", borderRadius: "var(--radius-sm)",
            border: `1.5px solid ${mode === m.id ? "var(--text)" : "var(--border)"}`,
            background: mode === m.id ? "var(--text)" : "var(--card)",
            color: mode === m.id ? "#fff" : "var(--text-sec)",
            fontWeight: 700, fontSize: "14px", cursor: "pointer",
            fontFamily: "var(--font)", transition: "all 0.15s",
          }}>{m.label}</button>
        ))}
      </div>

      <Card style={{ width: "100%", maxWidth: "320px" }} delay={100}>
        <div style={{ padding: "20px" }}>
          {mode === "create" ? (
            <>
              <Label>📝 帳本名稱</Label>
              <div style={{ marginBottom: "14px" }}>
                <Input value={tripName} onChange={(e) => setTripName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && tripName.trim() && onCreateTrip(tripName.trim())}
                  placeholder="例：東京五天四夜" maxLength={30} />
              </div>
              <Btn onClick={() => onCreateTrip(tripName.trim())} disabled={!tripName.trim()}
                style={{ width: "100%" }}>
                🚀 開始記帳
              </Btn>
            </>
          ) : (
            <>
              <Label>🔗 帳本 ID</Label>
              <div style={{ marginBottom: "14px" }}>
                <Input value={joinId} onChange={(e) => setJoinId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && joinId.trim() && onJoinTrip(joinId.trim())}
                  placeholder="貼上朋友給你的 ID..." />
              </div>
              <Btn onClick={() => onJoinTrip(joinId.trim())} disabled={!joinId.trim()}
                style={{ width: "100%" }}>
                📲 加入帳本
              </Btn>
            </>
          )}
          {error && (
            <div style={{
              marginTop: "12px", padding: "8px 12px",
              background: "#fff5f5", border: "1px solid #fecaca",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px", color: "var(--negative)", textAlign: "center",
            }}>{error}</div>
          )}
        </div>
      </Card>
    </div>
  );
}
