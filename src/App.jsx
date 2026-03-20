import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import MembersPage from "./components/MembersPage";
import AddExpensePage from "./components/AddExpensePage";
import ExpensesPage from "./components/ExpensesPage";
import SettlePage from "./components/SettlePage";
import {
  createTrip, updateTripName, addMember, removeMember,
  addExpense, updateExpense, deleteExpense,
  useTrip, useExpenses,
} from "./lib/firestore";

function getTripIdFromHash() {
  return window.location.hash.replace("#", "").trim() || null;
}

export default function App() {
  const [tripId, setTripId] = useState(getTripIdFromHash);
  const [tab, setTab] = useState("expenses");
  const [editing, setEditing] = useState(null);
  const [landingError, setLandingError] = useState(null);

  const { trip, loading, error } = useTrip(tripId);
  const expenses = useExpenses(tripId);

  // Listen for hash changes (e.g. back button)
  useEffect(() => {
    const onHash = () => setTripId(getTripIdFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // ── Landing page (no trip selected) ──
  if (!tripId) {
    return (
      <LandingPage
        error={landingError}
        onCreateTrip={async (name) => {
          try {
            const id = await createTrip(name);
            window.location.hash = id;
            setTripId(id);
            setLandingError(null);
          } catch (e) {
            setLandingError("建立失敗，請檢查 Firebase 設定");
          }
        }}
        onJoinTrip={(id) => {
          window.location.hash = id;
          setTripId(id);
          setLandingError(null);
        }}
      />
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <div style={{
        maxWidth: "480px", margin: "0 auto", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font)", color: "var(--text-muted)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>⏳</div>
          <div>載入中...</div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !trip) {
    return (
      <div style={{
        maxWidth: "480px", margin: "0 auto", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font)", color: "var(--text-muted)",
        flexDirection: "column", gap: "12px",
      }}>
        <div style={{ fontSize: "32px" }}>😵</div>
        <div>{error || "找不到帳本"}</div>
        <button onClick={() => { window.location.hash = ""; setTripId(null); }} style={{
          padding: "8px 16px", borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)", background: "var(--card)",
          cursor: "pointer", fontFamily: "var(--font)", fontWeight: 600,
        }}>回首頁</button>
      </div>
    );
  }

  const members = trip.members || [];

  // ── Share button ──
  const handleShare = async () => {
    const url = window.location.href;
    const text = `加入「${trip.name}」的分帳帳本！`;
    if (navigator.share) {
      try { await navigator.share({ title: "ㄅㄉㄓ女團", text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("已複製帳本連結！");
    }
  };

  return (
    <div style={{
      maxWidth: "480px", margin: "0 auto", minHeight: "100vh",
      background: "var(--bg)", fontFamily: "var(--font)", paddingBottom: "72px",
    }}>
      <Header
        name={trip.name}
        onSave={(newName) => updateTripName(tripId, newName)}
      />

      {/* Share bar */}
      <div className="fade" style={{
        padding: "8px 16px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: "1px solid var(--border)",
        background: "var(--card)",
      }}>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
          ID: {tripId}
        </div>
        <button onClick={handleShare} style={{
          padding: "4px 12px", borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)", background: "var(--subtle)",
          fontSize: "12px", fontWeight: 600, cursor: "pointer",
          fontFamily: "var(--font)", color: "var(--text-sec)",
        }}>📤 分享帳本</button>
      </div>

      {tab === "members" && (
        <MembersPage
          members={members}
          onAddMember={(name) => addMember(tripId, members, name)}
          onRemoveMember={(id) => removeMember(tripId, members, id)}
        />
      )}
      {tab === "add" && (
        <AddExpensePage
          members={members}
          editing={editing}
          onSave={async (expense) => {
            try {
              if (editing) {
                await updateExpense(tripId, editing.id, expense);
              } else {
                await addExpense(tripId, expense);
              }
              setEditing(null);
              setTab("expenses");
            } catch (err) {
              console.error("Save expense failed:", err);
              alert("儲存失敗：" + err.message);
            }
          }}
          onCancel={() => { setEditing(null); setTab("expenses"); }}
        />
      )}
      {tab === "expenses" && (
        <ExpensesPage
          expenses={expenses}
          members={members}
          onEdit={(e) => { setEditing(e); setTab("add"); }}
          onDelete={async (id) => {
            if (confirm("確定刪除？")) await deleteExpense(tripId, id);
          }}
          onGoAdd={() => setTab("add")}
        />
      )}
      {tab === "settle" && (
        <SettlePage expenses={expenses} members={members} />
      )}

      <TabBar active={tab} onChange={setTab} count={expenses.length} />
    </div>
  );
}
