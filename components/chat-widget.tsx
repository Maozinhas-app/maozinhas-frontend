"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChatCircle,
  X,
  PaperPlaneTilt,
  Star,
  MapPin,
  CheckCircle,
  Robot,
  Phone,
  ArrowsOutSimple,
  ArrowsInSimple,
} from "@phosphor-icons/react";

/* ─── API ── */
const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ||
  "https://maozinhas-lac.vercel.app/api/chat";

/* ─── Types ── */
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Provider {
  id: string;
  name: string;
  service: string;
  rating: number;
  distance: number;
  verified: boolean;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    cep: string;
  };
}

interface AssistantEntry {
  message: Message;
  providers?: Provider[];
}

type ConversationEntry =
  | { type: "user"; message: Message }
  | { type: "assistant"; entry: AssistantEntry };

/* ─── ProviderCard ── */
function ProviderCard({
  provider,
  onSelect,
}: {
  provider: Provider;
  onSelect: (p: Provider) => void;
}) {
  return (
    <div className="flex-shrink-0 w-52 bg-white rounded-2xl p-3.5 shadow-md border border-gray-100 select-none">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-snug truncate">
            {provider.name}
          </p>
          <p className="text-xs text-gray-400 capitalize mt-0.5">{provider.service}</p>
        </div>
        {provider.verified && (
          <CheckCircle weight="fill" className="w-4 h-4 text-[#5eb3b3] flex-shrink-0 mt-0.5" />
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1">
          <Star weight="fill" className="w-3 h-3 text-yellow-400" />
          <span className="text-xs font-semibold text-gray-700">
            {provider.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <MapPin className="w-3 h-3" />
          <span className="text-xs">{provider.distance.toFixed(1)} km</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5">
        <button
          onClick={() => onSelect(provider)}
          className="flex-1 py-2 text-xs font-semibold rounded-xl bg-[#5eb3b3]/10 text-[#5eb3b3] hover:bg-[#5eb3b3]/20 active:bg-[#5eb3b3]/30 transition-colors"
        >
          Selecionar
        </button>
        {provider.phone && (
          <a
            href={`https://wa.me/55${provider.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors flex-shrink-0"
            title="WhatsApp"
          >
            <Phone weight="fill" className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Typing indicator ── */
function TypingDots() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-[#5eb3b3]/15 flex items-center justify-center flex-shrink-0">
        <Robot weight="fill" className="w-4 h-4 text-[#5eb3b3]" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
        {[0, 0.18, 0.36].map((d, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ── */
export function ChatWidget() {
  const [isOpen, setIsOpen]       = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  /* Full conversation for display, messages array for API */
  const [conversation, setConversation] = useState<ConversationEntry[]>([
    {
      type: "assistant",
      entry: {
        message: {
          role: "assistant",
          content:
            "Olá! 👋 Sou o assistente do Mãozinhas. Me diga o que você precisa — um encanador, eletricista, personal trainer — e vou encontrar os melhores profissionais da sua região!",
        },
      },
    },
  ]);

  /* Pending provider selection */
  const pendingProvider = useRef<{ name: string } | null>(null);
  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const inputRef        = useRef<HTMLInputElement>(null);

  /* Extract raw messages for the API */
  const getApiMessages = useCallback((): Message[] =>
    conversation.map((e) =>
      e.type === "user" ? e.message : e.entry.message
    ), [conversation]);

  /* Scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading]);

  /* Focus input when opened */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setHasUnread(false);
    }
  }, [isOpen]);

  /* Send message */
  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const text = overrideText ?? input.trim();
      if (!text || loading) return;

      const userMsg: Message = { role: "user", content: text };
      if (!overrideText) setInput("");

      const currentMessages = getApiMessages();

      /* Optimistically add user bubble */
      setConversation((prev) => [
        ...prev,
        { type: "user", message: userMsg },
      ]);
      setLoading(true);

      try {
        const body: { messages: Message[]; selectedProvider?: { name: string } } = {
          messages: [...currentMessages, userMsg],
        };

        if (pendingProvider.current) {
          body.selectedProvider = pendingProvider.current;
          pendingProvider.current = null;
        }

        const res = await fetch(CHAT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const assistantMsg: Message = {
          role: "assistant",
          content: data.message ?? "Desculpe, não consegui processar sua solicitação.",
        };

        setConversation((prev) => [
          ...prev,
          {
            type: "assistant",
            entry: {
              message: assistantMsg,
              providers: data.providers?.length ? data.providers : undefined,
            },
          },
        ]);

        /* Notify if widget is closed */
        if (!isOpen) setHasUnread(true);
      } catch {
        setConversation((prev) => [
          ...prev,
          {
            type: "assistant",
            entry: {
              message: {
                role: "assistant",
                content:
                  "Ops! Tive um problema de conexão. Por favor, tente novamente em instantes.",
              },
            },
          },
        ]);
      }

      setLoading(false);
    },
    [input, loading, getApiMessages, isOpen]
  );

  /* Provider selected from carousel */
  const handleProviderSelect = useCallback(
    (provider: Provider) => {
      pendingProvider.current = { name: provider.name };
      sendMessage(`Quero contratar ${provider.name}`);
    },
    [sendMessage]
  );

  /* Panel dimensions */
  const panelCls = expanded
    ? "fixed inset-4 sm:inset-6 z-50"
    : "fixed bottom-[76px] right-4 sm:bottom-[84px] sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] max-h-[72vh] sm:max-h-[580px]";

  return (
    <>
      {/* ══════════════════════════════════════
          CHAT PANEL
      ══════════════════════════════════════ */}
      {isOpen && (
        <div
          className={`${panelCls} flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`}
          style={{ animation: "slideInUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5eb3b3] to-[#4a9d9d] px-4 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
                <Robot weight="fill" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">Mãozinhas</p>
                <p className="text-white/65 text-[11px] mt-0.5">Assistente virtual</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Expand / collapse — sm+ only */}
              <button
                onClick={() => setExpanded((e) => !e)}
                className="hidden sm:flex w-8 h-8 items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                title={expanded ? "Minimizar" : "Expandir"}
              >
                {expanded
                  ? <ArrowsInSimple className="w-4 h-4" />
                  : <ArrowsOutSimple className="w-4 h-4" />
                }
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50/80">
            {conversation.map((entry, i) => {
              if (entry.type === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[78%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-[#5eb3b3] text-white text-sm leading-relaxed shadow-sm">
                      {entry.message.content}
                    </div>
                  </div>
                );
              }

              /* Assistant entry */
              const { message, providers } = entry.entry;
              return (
                <div key={i} className="space-y-2">
                  {/* Bubble */}
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#5eb3b3]/15 flex items-center justify-center flex-shrink-0 mb-0.5">
                      <Robot weight="fill" className="w-4 h-4 text-[#5eb3b3]" />
                    </div>
                    <div className="max-w-[78%] px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white text-gray-700 text-sm leading-relaxed shadow-sm border border-gray-100">
                      {message.content}
                    </div>
                  </div>

                  {/* Provider carousel */}
                  {providers && providers.length > 0 && (
                    <div className="ml-9 flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                      {providers.map((p) => (
                        <ProviderCard
                          key={p.id}
                          provider={p}
                          onSelect={handleProviderSelect}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {loading && <TypingDots />}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Digite sua mensagem..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm bg-white text-gray-800 rounded-xl border border-gray-200 focus:border-[#5eb3b3] focus:outline-none placeholder:text-gray-400 transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5eb3b3] to-[#4a9d9d] flex items-center justify-center text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:shadow-none flex-shrink-0"
              >
                <PaperPlaneTilt weight="fill" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          FLOATING BUTTON
      ══════════════════════════════════════ */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-br from-[#5eb3b3] to-[#3d8e8e]
          text-white
          shadow-[0_6px_24px_rgba(62,142,142,0.5)]
          hover:shadow-[0_8px_32px_rgba(62,142,142,0.65)]
          hover:scale-110 active:scale-95
          transition-all duration-200 ease-out
          flex items-center justify-center
          animate-fade-in"
        style={{ animationDelay: "1.5s", opacity: 0, animationFillMode: "forwards" }}
        aria-label={isOpen ? "Fechar chat" : "Abrir chat com assistente"}
      >
        {isOpen ? (
          <X weight="bold" className="w-5 h-5" />
        ) : (
          <ChatCircle weight="fill" className="w-7 h-7" />
        )}

        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
}
