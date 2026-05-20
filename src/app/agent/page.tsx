"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/useLanguage";
import { useTranslation } from "@/lib/translations";

type Message = { id: number; text: string; isBot: boolean };

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const SESSIONS_KEY = "mithra_sessions";
const ACTIVE_KEY = "mithra_active_session";

const QUICK_QUESTIONS = [
  "Show all high-risk customers",
  "How many verifications today?",
  "Who is pending manual review?",
  "Summarize recent rejections",
  "What is the auto-approval rate?",
  "Flag any watchlist matches",
];

const INITIAL_BOT_MESSAGE = (id: number): Message => ({
  id,
  text: "Hello! I am Mithra, your AI identity verification assistant. I have full context on your current customer log. Ask me about any customer, risk level, or compliance question.",
  isBot: true,
});

function generateTitle(messages: Message[]): string {
  const first = messages.find((m) => !m.isBot);
  if (!first) return "New conversation";
  const text = first.text.trim();
  return text.length > 36 ? text.slice(0, 36).trimEnd() + "…" : text;
}

function newSession(t: (key: string) => string): ChatSession {
  const id = Date.now().toString();
  return {
    id,
    title: t("agent.title"),
    messages: [INITIAL_BOT_MESSAGE(Date.now())],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {}
}

function groupByDate(sessions: ChatSession[]) {
  const now = Date.now();
  const DAY = 86_400_000;
  const today: ChatSession[] = [];
  const yesterday: ChatSession[] = [];
  const older: ChatSession[] = [];

  for (const s of sessions) {
    const diff = now - s.updatedAt;
    if (diff < DAY) today.push(s);
    else if (diff < 2 * DAY) yesterday.push(s);
    else older.push(s);
  }
  return { today, yesterday, older };
}

export default function AIAgentPage() {
  const [lang] = useLanguage();
  const t = useTranslation(lang);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Sidebar state ──
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // ── Chat state ──
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // ── Bootstrap from localStorage ──
  useEffect(() => {
    let loaded = loadSessions();
    if (loaded.length === 0) {
      const first = newSession(t);
      loaded = [first];
      saveSessions(loaded);
    }
    const savedActiveId = localStorage.getItem(ACTIVE_KEY) ?? loaded[0].id;
    const exists = loaded.find((s) => s.id === savedActiveId);
    const resolvedId = exists ? savedActiveId : loaded[0].id;
    setSessions(loaded);
    setActiveId(resolvedId);
  }, []);

  const activeSession = sessions.find((s) => s.id === activeId);
  const messages = activeSession?.messages ?? [];

  const updateSession = useCallback(
    (id: string, patch: Partial<ChatSession>) => {
      setSessions((prev) => {
        const next = prev.map((s) =>
          s.id === id ? { ...s, ...patch, updatedAt: Date.now() } : s
        );
        saveSessions(next);
        return next;
      });
    },
    []
  );

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Persist active session id ──
  useEffect(() => {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId]);

  // ── New chat ──
  const handleNewChat = () => {
    const s = newSession(t);
    setSessions((prev) => {
      const next = [s, ...prev];
      saveSessions(next);
      return next;
    });
    setActiveId(s.id);
    setError(null);
    setInputMessage("");
    inputRef.current?.focus();
  };

  // ── Switch session ──
  const handleSelectSession = (id: string) => {
    setActiveId(id);
    setError(null);
    setInputMessage("");
    // Close sidebar on mobile
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // ── Delete session ──
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) {
        const fresh = newSession(t);
        saveSessions([fresh]);
        setActiveId(fresh.id);
        return [fresh];
      }
      saveSessions(next);
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  // ── Rename ──
  const startRename = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(s.id);
    setRenameValue(s.title);
  };
  const commitRename = () => {
    if (!renamingId) return;
    const trimmed = renameValue.trim();
    if (trimmed) updateSession(renamingId, { title: trimmed });
    setRenamingId(null);
  };

  // ── Send message ──
  const handleSendMessage = useCallback(
    async (text?: string) => {
      const messageText = (text ?? inputMessage).trim();
      if (!messageText || isLoading || !activeId) return;

      const userMsg: Message = { id: Date.now(), text: messageText, isBot: false };
      const updatedMessages = [...messages, userMsg];

      // Update session messages + auto-title on first user message
      const isFirst = messages.filter((m) => !m.isBot).length === 0;
      updateSession(activeId, {
        messages: updatedMessages,
        title: isFirst ? generateTitle(updatedMessages) : activeSession?.title,
      });

      setInputMessage("");
      setIsLoading(true);
      setError(null);
      setLastUserMessage(messageText);

      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 503) {
            setError("overload");
          } else {
            throw new Error(data.error || `Server error: ${res.status}`);
          }
          return;
        }

        const botMsg: Message = { id: Date.now() + 1, text: data.reply, isBot: true };
        updateSession(activeId, { messages: [...updatedMessages, botMsg] });
      } catch (err: any) {
        setError(err.message || "Failed to reach Mithra. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [inputMessage, isLoading, activeId, messages, activeSession, updateSession]
  );

  // ── Speech to Text ──
  const startListening = () => {
    if (typeof window === "undefined") return;
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      setIsListening(false);
      console.error(event.error);
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setInputMessage(currentTranscript);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Re-create the dependency array explicitly
  const handleStartListening = useCallback(startListening, [lang]);

  const handleQuickQuestion = (q: string) => handleSendMessage(q);

  const handleClearChat = () => {
    updateSession(activeId, {
      messages: [INITIAL_BOT_MESSAGE(Date.now())],
      title: "New conversation",
    });
    setError(null);
  };

  // ── Group sessions ──
  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);
  const { today, yesterday, older } = groupByDate(sorted);

  const SidebarGroup = ({
    label,
    items,
  }: {
    label: string;
    items: ChatSession[];
  }) => {
    if (items.length === 0) return null;
    return (
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 pt-3 pb-1">
          {label}
        </p>
        {items.map((s) => (
          <div
            key={s.id}
            onClick={() => handleSelectSession(s.id)}
            className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
              s.id === activeId
                ? "bg-indigo-500/15 text-white"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            {renamingId === s.id ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") setRenamingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-xs bg-white/10 border border-indigo-500/30 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            ) : (
              <span className="flex-1 text-xs truncate font-medium leading-snug">
                {s.title}
              </span>
            )}

            {/* Hover actions */}
            {renamingId !== s.id && (
              <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
                <button
                  onClick={(e) => startRename(s, e)}
                  className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
                  title="Rename"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="w-6 h-6 rounded-md hover:bg-rose-500/20 flex items-center justify-center text-white/40 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
                  </svg>
                </button>
              </div>
            )}

            {/* Active indicator */}
            {s.id === activeId && renamingId !== s.id && (
              <div className="w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="relative h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <BackgroundVideo />
      <Navbar />

      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside
          className={`flex-shrink-0 flex flex-col border-r border-white/10 bg-[#06060f]/80 backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden ${
            sidebarOpen ? "w-64" : "w-0"
          }`}
        >
          <div className="flex flex-col h-full min-w-[256px]">
            {/* Sidebar header */}
            <div className="p-3 border-b border-white/5 flex-shrink-0">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/20 text-indigo-300 text-sm font-semibold transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New conversation
              </button>
            </div>

            {/* Session list */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 flex flex-col gap-1 scrollbar-thin">
              <SidebarGroup label={t("agent.today")} items={today} />
              <SidebarGroup label={t("agent.yesterday")} items={yesterday} />
              <SidebarGroup label={t("agent.older")} items={older} />
            </div>

            {/* Sidebar footer */}
            <div className="p-3 border-t border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2.5 px-2 py-2">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-bold">
                  U
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/70 truncate">Compliance Team</p>
                  <p className="text-[10px] text-white/30 truncate">KYC Mithra Admin</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Chat Area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Chat toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Toggle sidebar */}
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                </svg>
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                </div>
                <div>
                  <p className="font-semibold text-sm font-['General_Sans'] leading-none">Mithra</p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    Online
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              Clear chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-5 px-4 md:px-8 py-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.isBot ? "flex-row" : "flex-row-reverse"}`}>
                  <div className="flex-shrink-0 mt-1">
                    {msg.isBot ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    msg.isBot
                      ? "liquid-glass rounded-tl-sm border border-white/10"
                      : "bg-indigo-600/80 backdrop-blur-md border border-indigo-500/50 rounded-tr-sm"
                  }`}>
                    <p className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mt-1">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  </div>
                  <div className="liquid-glass rounded-2xl rounded-tl-sm border border-white/10 p-4 flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 150, 300].map((d) => (
                        <div key={d} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                    <span className="text-sm text-white/40">Mithra is thinking…</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mt-1">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div className="liquid-glass rounded-2xl rounded-tl-sm border border-amber-500/20 p-4 flex flex-col gap-3">
                    {error === "overload" ? (
                      <>
                        <p className="text-sm text-white/80">⏳ High demand right now. Give me a moment and try again.</p>
                        <button
                          onClick={() => { setError(null); if (lastUserMessage) handleSendMessage(lastUserMessage); }}
                          className="self-start text-xs px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 transition-colors"
                        >
                          ↺ Retry
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-rose-300">⚠ {error}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips */}
          {messages.filter((m) => !m.isBot).length === 0 && (
            <div className="flex flex-wrap gap-2 px-4 md:px-8 pb-3">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 hover:text-indigo-200 transition-all disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 md:px-8 pb-5 flex-shrink-0">
            <div className="liquid-glass rounded-2xl p-2 border border-white/10 flex items-center gap-2">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex-1 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  id="chat-input"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                  placeholder={t("agent.placeholder") as string}
                  className="flex-1 bg-transparent border-none focus:outline-none text-white px-4 py-3 placeholder:text-white/30 text-sm disabled:opacity-50 min-w-[200px]"
                />
                
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleStartListening}
                  disabled={isLoading}
                  className={`flex-shrink-0 p-3 rounded-xl transition-all ${
                    isListening 
                      ? "bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/30" 
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-transparent"
                  }`}
                  aria-label="Start voice input"
                  title="Speech to text"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>

                <Button
                  type="submit"
                  variant="heroSecondary"
                  disabled={isLoading || !inputMessage.trim()}
                  className="rounded-xl px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/40 border-indigo-500/30 flex-shrink-0 disabled:opacity-40 transition-all"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 -rotate-90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                    </svg>
                  )}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
