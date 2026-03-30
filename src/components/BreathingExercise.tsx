import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wind, Play, Pause, RefreshCw } from "lucide-react";

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            if (phase === "inhale") {
              setPhase("hold");
              return 4;
            } else if (phase === "hold") {
              setPhase("exhale");
              return 4;
            } else {
              setPhase("inhale");
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const reset = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimer(4);
  };

  return (
    <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm flex flex-col items-center text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Mindful Exercise</h2>
        <p className="text-gray-500">Calm your nervous system with focused box breathing.</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ scale: phase === "inhale" ? 0.8 : 1.2, opacity: 0 }}
            animate={{ 
              scale: phase === "inhale" ? 1.2 : phase === "exhale" ? 0.8 : 1.2, 
              opacity: 1 
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${
              phase === "inhale" ? "bg-emerald-500" : phase === "hold" ? "bg-teal-500" : "bg-emerald-600"
            }`}
          />
        </AnimatePresence>

        <motion.div
          animate={{ 
            scale: isActive ? (phase === "inhale" ? 1.5 : phase === "exhale" ? 1 : 1.5) : 1,
            borderColor: phase === "inhale" ? "#10b981" : phase === "hold" ? "#14b8a6" : "#059669"
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center bg-white shadow-inner relative z-10"
        >
          <span className="text-4xl font-black text-gray-900 mb-1">{timer}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {isActive ? phase : "Ready?"}
          </span>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 ${
            isActive 
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-gray-100" 
              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100"
          }`}
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isActive ? "Pause" : "Start Session"}
        </button>
        <button
          onClick={reset}
          className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-md">
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Inhale</p>
          <p className="text-sm font-bold text-gray-700">4 Seconds</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Hold</p>
          <p className="text-sm font-bold text-gray-700">4 Seconds</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Exhale</p>
          <p className="text-sm font-bold text-gray-700">4 Seconds</p>
        </div>
      </div>
    </div>
  );
}
