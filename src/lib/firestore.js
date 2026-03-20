import { useState, useEffect } from "react";
import {
  doc, collection, addDoc, updateDoc, deleteDoc, setDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Create a new trip ──
export async function createTrip(name) {
  const tripId = uid();
  await setDoc(doc(db, "trips", tripId), {
    name,
    members: [
      { id: uid(), name: "我" },
      { id: uid(), name: "旅伴A" },
    ],
    createdAt: serverTimestamp(),
  });
  return tripId;
}

// ── Update trip name ──
export async function updateTripName(tripId, name) {
  await updateDoc(doc(db, "trips", tripId), { name });
}

// ── Update members ──
export async function updateMembers(tripId, members) {
  await updateDoc(doc(db, "trips", tripId), { members });
}

// ── Add member ──
export async function addMember(tripId, currentMembers, name) {
  const usedEmojis = currentMembers.map((m) => m.emoji).filter(Boolean);
  const allEmojis = ["🐻","🐱","🦊","🐸","🐰","🐧","🐶","🦄"];
  const available = allEmojis.filter((e) => !usedEmojis.includes(e));
  const emoji = available[0] || allEmojis[currentMembers.length % allEmojis.length];
  const newMember = { id: uid(), name, emoji };
  const updated = [...currentMembers, newMember];
  await updateDoc(doc(db, "trips", tripId), { members: updated });
  return updated;
}

// ── Update member (name / emoji) ──
export async function updateMember(tripId, currentMembers, memberId, changes) {
  const updated = currentMembers.map((m) =>
    m.id === memberId ? { ...m, ...changes } : m
  );
  await updateDoc(doc(db, "trips", tripId), { members: updated });
  return updated;
}

// ── Remove member ──
export async function removeMember(tripId, currentMembers, memberId) {
  const updated = currentMembers.filter((m) => m.id !== memberId);
  await updateDoc(doc(db, "trips", tripId), { members: updated });
  return updated;
}

// ── Expense CRUD ──
export async function addExpense(tripId, expense) {
  await addDoc(collection(db, "trips", tripId, "expenses"), {
    ...expense,
    createdAt: serverTimestamp(),
  });
}

export async function updateExpense(tripId, expenseId, expense) {
  const { id, ...data } = expense;
  await updateDoc(doc(db, "trips", tripId, "expenses", expenseId), data);
}

export async function deleteExpense(tripId, expenseId) {
  await deleteDoc(doc(db, "trips", tripId, "expenses", expenseId));
}

// ── Real-time hooks ──

export function useTrip(tripId) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    const unsub = onSnapshot(
      doc(db, "trips", tripId),
      (snap) => {
        if (snap.exists()) {
          setTrip({ id: snap.id, ...snap.data() });
        } else {
          setError("找不到這個帳本");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Trip listener error:", err);
        setError("無法連線到帳本");
        setLoading(false);
      }
    );
    return unsub;
  }, [tripId]);

  return { trip, loading, error };
}

export function useExpenses(tripId) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!tripId) return;
    const q = query(
      collection(db, "trips", tripId, "expenses"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [tripId]);

  return expenses;
}
