"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "你们支持哪些PIX Moving底盘型号？",
  "CAN接口是什么协议规格？",
  "系统支持雨天运营吗？",
  "ROS2集成需要哪些Topic？",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages([
          ...newMessages,
          { role: "assistant", content: accumulated },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "抱歉，连接出现问题，请稍后重试。" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
          AI
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900">
            自动驾驶售前顾问
          </h1>
          <p className="text-xs text-gray-500">技术售前 AI · 7×24 小时在线</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-xs text-gray-500">在线</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚗</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                您好，我是自动驾驶售前顾问 AI
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                可以帮您解答产品规格、集成方案、场景可行性等技术问题
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-gray-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                  AI
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose-chat">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {loading && i === messages.length - 1 && !msg.content && (
                      <span className="flex gap-1 py-1">
                        {[0, 1, 2].map((n) => (
                          <span
                            key={n}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${n * 0.15}s` }}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0 mt-1">
                  我
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的技术问题… (Enter 发送，Shift+Enter 换行)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-36 overflow-y-auto"
            style={{ minHeight: "48px" }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          AI 回答仅供参考，涉及商务/安全认证问题将由专人跟进
        </p>
      </div>
    </div>
  );
}
