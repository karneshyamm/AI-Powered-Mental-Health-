import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, deleteUser, updateProfile } from "firebase/auth";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  Sparkles, 
  BarChart2, 
  BookOpen, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Heart,
  Activity,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
import ChatAI from "../components/ChatAI";
import MoodTracker from "../components/MoodTracker";
import Journal from "../components/Journal";
import BreathingExercise from "../components/BreathingExercise";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard />, label: "Overview" },
    { path: "/dashboard/chat", icon: <Sparkles className="text-emerald-500" />, label: "Chat AI" },
    { path: "/dashboard/mood", icon: <BarChart2 />, label: "Mood Tracker" },
    { path: "/dashboard/journal", icon: <BookOpen />, label: "Journal" },
    { path: "/dashboard/breathing", icon: <Activity />, label: "Exercise" },
    { path: "/dashboard/help", icon: <HelpCircle />, label: "Help" },
    { path: "/dashboard/settings", icon: <Settings />, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 shrink-0">
            <Heart className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="text-xl font-bold text-gray-900 truncate">Serenity</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
                location.pathname === item.path 
                  ? "bg-emerald-50 text-emerald-600" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="font-semibold">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-3 w-full rounded-2xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="shrink-0" />
            {isSidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {navItems.find(i => i.path === location.pathname)?.label || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
              {auth.currentUser?.displayName?.[0] || "U"}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/chat" element={<ChatAI />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/breathing" element={<BreathingExercise />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

function Overview() {
  const [recentMood, setRecentMood] = useState<any>(null);
  const [recentJournal, setRecentJournal] = useState<any>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const moodPath = `users/${auth.currentUser.uid}/moods`;
    const moodQuery = query(
      collection(db, moodPath),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const journalPath = `users/${auth.currentUser.uid}/journals`;
    const journalQuery = query(
      collection(db, journalPath),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const unsubMood = onSnapshot(moodQuery, (snap) => {
      if (!snap.empty) setRecentMood(snap.docs[0].data());
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, moodPath);
    });

    const unsubJournal = onSnapshot(journalQuery, (snap) => {
      if (!snap.empty) setRecentJournal(snap.docs[0].data());
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, journalPath);
    });

    return () => {
      unsubMood();
      unsubJournal();
    };
  }, [auth.currentUser]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-100"
      >
        <h1 className="text-3xl font-bold mb-2">Hello, {auth.currentUser?.displayName || "Friend"}!</h1>
        <p className="text-emerald-100 text-lg">How are you feeling today? Take a moment to check in with yourself.</p>
      </motion.div>

      {/* Recent Activity Section */}
      {(recentMood || recentJournal) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {recentMood && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
              <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Latest Mood</h4>
              <div className="flex items-center gap-3">
                <span className="text-2xl capitalize font-bold text-emerald-900">{recentMood.mood}</span>
                <span className="text-xs text-emerald-600 bg-white px-2 py-1 rounded-full border border-emerald-100">
                  {new Date(recentMood.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {recentMood.note && <p className="text-sm text-emerald-700 mt-2 italic line-clamp-1">"{recentMood.note}"</p>}
            </div>
          )}
          {recentJournal && (
            <div className="bg-teal-50 border border-teal-100 p-6 rounded-3xl">
              <h4 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-2">Latest Reflection</h4>
              <p className="text-sm text-teal-900 font-medium line-clamp-2 mb-2">{recentJournal.content}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-teal-600 bg-white px-2 py-0.5 rounded-full border border-teal-100 uppercase">
                  {recentJournal.sentiment}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-4">
            <BarChart2 />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Mood Check-in</h3>
          <p className="text-gray-500 text-sm mb-4">You haven't logged your mood today. Tracking daily helps identify patterns.</p>
          <Link to="/dashboard/mood" className="text-emerald-600 font-bold text-sm hover:underline">Log Mood →</Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-4">
            <BookOpen />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Journaling</h3>
          <p className="text-gray-500 text-sm mb-4">Writing down your thoughts can help clear your mind and reduce stress.</p>
          <Link to="/dashboard/journal" className="text-emerald-600 font-bold text-sm hover:underline">Start Writing →</Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
            <Activity />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Wellness Exercise</h3>
          <p className="text-gray-500 text-sm mb-4">Feeling overwhelmed? A quick 2-minute breathing session can help.</p>
          <Link to="/dashboard/breathing" className="text-emerald-600 font-bold text-sm hover:underline">Start Exercise →</Link>
        </div>
      </div>

      {/* Daily Inspiration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center shrink-0 rotate-3">
            <Sparkles className="w-12 h-12 text-emerald-600" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 italic font-serif">"The only way to do great work is to love what you do."</h3>
            <p className="text-gray-500 font-medium mb-6">— Steve Jobs</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100">Mindfulness</span>
              <span className="px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-xs font-bold uppercase tracking-wider border border-teal-100">Growth</span>
              <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">Resilience</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Community / Support Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-emerald-900 rounded-[2rem] p-8 text-white flex items-center justify-between group cursor-pointer hover:bg-emerald-800 transition-all">
          <div>
            <h4 className="text-xl font-bold mb-1">Need someone to talk to?</h4>
            <p className="text-emerald-200 text-sm">Our AI companion is available 24/7 for you.</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-teal-900 rounded-[2rem] p-8 text-white flex items-center justify-between group cursor-pointer hover:bg-teal-800 transition-all">
          <div>
            <h4 className="text-xl font-bold mb-1">Explore Wellness Library</h4>
            <p className="text-teal-200 text-sm">Discover articles and tips for your mental health.</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Weekly Goal Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[2rem] p-8 border border-emerald-100 shadow-sm border-l-8 border-l-emerald-500"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Weekly Wellness Goal</h3>
            <p className="text-gray-500 text-sm">Complete 5 mood check-ins and 3 journal entries this week.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-64">
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-emerald-500"
              />
            </div>
            <span className="text-sm font-bold text-emerald-600">65%</span>
          </div>
          <button className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all whitespace-nowrap">
            View Details
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function HelpPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Crisis Resources</h2>
        <div className="space-y-6">
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
            <h3 className="text-red-700 font-bold text-lg mb-2">Emergency Help</h3>
            <p className="text-red-600 mb-4">If you are in immediate danger or experiencing a crisis, please contact emergency services or a crisis hotline immediately.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="font-bold text-gray-900">National Suicide Prevention</p>
                <p className="text-red-600 text-xl font-black">988</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="font-bold text-gray-900">Crisis Text Line</p>
                <p className="text-red-600 text-xl font-black">Text HOME to 741741</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-emerald-600 mb-4">Daily Wellness Tips</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold shrink-0">1</div>
              <p className="text-sm text-gray-600">Practice mindful breathing for 5 minutes every morning to set a calm tone for the day.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold shrink-0">2</div>
              <p className="text-sm text-gray-600">Stay hydrated and maintain a balanced diet; physical health directly impacts mental clarity.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold shrink-0">3</div>
              <p className="text-sm text-gray-600">Limit screen time before bed to improve sleep quality and reduce nighttime anxiety.</p>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-teal-600 mb-4">Mental Health Support</h3>
          <div className="space-y-4">
            <div className="p-4 bg-teal-50 rounded-2xl">
              <p className="font-bold text-teal-900 text-sm mb-1">Self-Care Checklist</p>
              <p className="text-xs text-teal-700">✓ 8 hours of sleep<br/>✓ 30 mins movement<br/>✓ Journaled thoughts<br/>✓ Connected with a friend</p>
            </div>
            <p className="text-sm text-gray-500 italic">"Remember, it's okay not to be okay. Healing is not linear, and every small step counts."</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser || !displayName.trim()) return;
    setIsUpdating(true);
    setUpdateMessage(null);
    try {
      await updateProfile(auth.currentUser, { displayName });
      // Also update in Firestore
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        name: displayName
      }, { merge: true });
      setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error("Update Profile Error:", error);
      setUpdateMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteUser(user);
        navigate("/");
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Please re-authenticate to delete your account.");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
        <div className="space-y-6 max-w-md">
          {updateMessage && (
            <div className={`p-4 rounded-xl text-sm font-bold ${
              updateMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {updateMessage.text}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Display Name</label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Email Address</label>
            <input 
              type="email" 
              disabled 
              defaultValue={auth.currentUser?.email || ""} 
              className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-500"
            />
          </div>
          <button 
            onClick={handleUpdateProfile}
            disabled={isUpdating || !displayName.trim()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
        <h3 className="text-xl font-bold text-red-700 mb-2">Danger Zone</h3>
        <p className="text-red-600 text-sm mb-6">Deleting your account is permanent and will erase all your data, including mood logs and journal entries.</p>
        
        {!showDeleteConfirm ? (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 transition-all"
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-700 font-bold">
              <AlertTriangle className="w-5 h-5" />
              Are you absolutely sure?
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleDeleteAccount}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                Yes, Delete My Account
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

