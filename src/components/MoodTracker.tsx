import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Smile, Frown, Meh, AlertCircle, Zap } from "lucide-react";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

const moods = [
  { label: "happy", icon: <Smile className="w-8 h-8" />, color: "bg-green-100 text-green-600", border: "border-green-200" },
  { label: "neutral", icon: <Meh className="w-8 h-8" />, color: "bg-emerald-100 text-emerald-600", border: "border-emerald-200" },
  { label: "anxious", icon: <AlertCircle className="w-8 h-8" />, color: "bg-yellow-100 text-yellow-600", border: "border-yellow-200" },
  { label: "stressed", icon: <Zap className="w-8 h-8" />, color: "bg-orange-100 text-orange-600", border: "border-orange-200" },
  { label: "sad", icon: <Frown className="w-8 h-8" />, color: "bg-purple-100 text-purple-600", border: "border-purple-200" },
];

const moodValues: Record<string, number> = {
  happy: 5,
  neutral: 3,
  anxious: 2,
  stressed: 1,
  sad: 0
};

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const path = `users/${auth.currentUser.uid}/moods`;
    const q = query(
      collection(db, path),
      orderBy("timestamp", "desc"),
      limit(7)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        value: moodValues[doc.data().mood] || 0,
        date: new Date(doc.data().timestamp).toLocaleDateString('en-US', { weekday: 'short' })
      })).reverse();
      setHistory(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleSubmit = async () => {
    if (!selectedMood || !auth.currentUser) return;
    setLoading(true);
    const path = `users/${auth.currentUser.uid}/moods`;
    try {
      await addDoc(collection(db, path), {
        mood: selectedMood,
        note: note,
        timestamp: new Date().toISOString()
      });
      setSelectedMood("");
      setNote("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How are you feeling right now?</h2>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => setSelectedMood(m.label)}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                selectedMood === m.label 
                  ? `${m.color} ${m.border} scale-105 shadow-md` 
                  : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-white hover:border-gray-200"
              }`}
            >
              {m.icon}
              <span className="text-xs font-bold capitalize">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 ml-1">Add a note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's making you feel this way?"
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none h-24"
          />
          <button
            onClick={handleSubmit}
            disabled={!selectedMood || loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 active:scale-95"
          >
            {loading ? "Logging..." : "Log Mood"}
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Mood Trends</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis hide domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#059669" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
