import { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { motion, AnimatePresence } from "motion/react";
import { Book, Plus, Calendar, Trash2, Search, Brain } from "lucide-react";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
import { ai, MODELS } from "../lib/gemini";

export default function Journal() {
  const [entries, setEntries] = useState<any[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const path = `users/${auth.currentUser.uid}/journals`;
    const q = query(
      collection(db, path),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleSave = async () => {
    if (!content.trim() || !auth.currentUser) return;
    setLoading(true);
    setAnalyzing(true);
    
    try {
      // Analyze sentiment via Gemini directly
      const response = await ai.models.generateContent({
        model: MODELS.ANALYSIS,
        contents: [
          {
            role: "user",
            parts: [{ text: `Analyze the sentiment of this journal entry and return a JSON object with 'sentiment' (one of: happy, sad, anxious, stressed, neutral), 'score' (0-1), and 'summary' (short summary). Entry: "${content}"` }]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const analysis = JSON.parse(response.text || "{}");

      const path = `users/${auth.currentUser.uid}/journals`;
      await addDoc(collection(db, path), {
        content,
        sentiment: analysis.sentiment || "neutral",
        summary: analysis.summary || "",
        timestamp: new Date().toISOString()
      });
      
      setContent("");
      setIsWriting(false);
    } catch (error) {
      console.error("Sentiment Analysis Error:", error);
      handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser?.uid}/journals`);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Journal</h2>
          <p className="text-gray-500">Reflect on your day and clear your mind.</p>
        </div>
        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Entry
          </button>
        )}
      </div>

      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts..."
              className="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none h-64 text-lg leading-relaxed"
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsWriting(false)}
                className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!content.trim() || loading}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Brain className="w-5 h-5 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  "Save Entry"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            layout
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {new Date(entry.timestamp).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  entry.sentiment === 'happy' ? 'bg-green-100 text-green-600' :
                  entry.sentiment === 'sad' ? 'bg-purple-100 text-purple-600' :
                  entry.sentiment === 'anxious' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {entry.sentiment}
                </span>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed line-clamp-3">{entry.content}</p>
            {entry.summary && (
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-start gap-2">
                <Brain className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <p className="text-xs text-gray-500 italic">AI Summary: {entry.summary}</p>
              </div>
            )}
          </motion.div>
        ))}
        {entries.length === 0 && !isWriting && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No journal entries yet. Start your first reflection!</p>
          </div>
        )}
      </div>
    </div>
  );
}
