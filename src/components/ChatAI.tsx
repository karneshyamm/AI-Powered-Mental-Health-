import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Sparkles, AlertTriangle } from "lucide-react";
import { getAI, MODELS } from "../lib/gemini";

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I'm Serenity, your AI companion. How are you feeling today? I'm here to listen and support you." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkApiKey = async () => {
    // Only check if we are in the AI Studio environment
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
      return hasKey;
    }
    
    // Outside AI Studio, we check for the environment variable directly
    const envKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
    const hasEnvKey = !!envKey;
    setHasApiKey(hasEnvKey);
    return hasEnvKey;
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  const handleConnectAI = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      await checkApiKey();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Proactively check for API key if using platform tools
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        await checkApiKey();
      }
    }

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = getAI();
      // Gemini API requires history to start with a 'user' role and alternate roles.
      // We use the messages already in state (which is the state BEFORE the current user message).
      // We exclude the very first AI greeting to ensure history starts with a user message.
      const history = messages
        .filter((m, i) => !(i === 0 && m.role === "ai"))
        .map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        }));

      const response = await ai.models.generateContent({
        model: MODELS.CHAT,
        contents: [
          ...history,
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ],
        config: {
          systemInstruction: "You are Serenity, a compassionate and supportive mental health companion. Your goal is to provide emotional support, use CBT techniques to help users reframe negative thoughts, and offer mindfulness suggestions. If you detect any signs of self-harm or crisis, you MUST provide emergency resources and encourage the user to seek professional help immediately. Keep your responses concise, warm, and empathetic.",
        }
      });

      if (response.text) {
        setMessages(prev => [...prev, { role: "ai", content: response.text }]);
      }
    } catch (error: any) {
      console.error("Chat Error Details:", error);
      
      // Handle "Requested entity was not found" by prompting for key selection again
      if (error?.message?.includes("Requested entity was not found") || error?.message?.includes("API_KEY_INVALID") || error?.message?.includes("API key not found")) {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
          await window.aistudio.openSelectKey();
          await checkApiKey();
        }
      }

      let errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      
      if (error?.message?.includes("API_KEY_INVALID") || error?.message?.includes("API key not found")) {
        errorMessage = "AI features are currently unavailable. Please ensure the Gemini API key is correctly configured in the environment.";
      }
      
      setMessages(prev => [...prev, { role: "ai", content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 bg-emerald-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-md shadow-emerald-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Serenity AI</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 font-medium">Online & Listening</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasApiKey === false && window.aistudio && (
            <button
              onClick={handleConnectAI}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-xs font-bold hover:bg-amber-100 transition-all"
            >
              <AlertTriangle className="w-3 h-3" />
              Connect AI Key
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-emerald-100 text-emerald-600 text-xs font-bold">
            <Sparkles className="w-3 h-3" />
            CBT Support Active
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-teal-100 text-teal-600" : "bg-emerald-600 text-white"
                }`}>
                  {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === "user" 
                    ? "bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-100" 
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-emerald-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Serenity is an AI companion, not a replacement for professional medical help.
        </p>
      </form>
    </div>
  );
}
