"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'emyka';
};

export default function ContactCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "¡Hola! Soy Emyka 💜. ¿En qué puedo ayudarte hoy? Si tienes alguna duda sobre tu manual o lectura, estoy aquí para resolverla.", 
      sender: 'emyka' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [tone, setTone] = useState<'default' | 'formal'>('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  
  const handleSendMessage = async (retrying = false) => {
    if (!inputValue.trim() && !retrying) return;

    // Si es reintento, tomar el último mensaje del usuario
    const userText = retrying
      ? messages.filter((m) => m.sender === 'user').slice(-1)[0]?.text || ''
      : inputValue;

    if (!userText.trim()) return;

    if (!retrying) {
      const newUserMessage: Message = {
        id: Date.now(),
        text: userText,
        sender: 'user'
      };
      setMessages(prev => [...prev, newUserMessage]);
      setInputValue("");
    }
    setIsTyping(true);
    setLastError(null);

    try {
      // Llamada al backend de Python (Emy AI)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText, tone }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const newEmykaMessage: Message = {
        id: Date.now() + 1,
        text: data.response, // Respuesta de Emy
        sender: 'emyka'
      };
      setMessages(prev => [...prev, newEmykaMessage]);
    } catch (error) {
      console.error("Error connecting to Emy AI:", error);
      // Evitar duplicar mensajes de error si ya hay uno al final
      setLastError("Lo siento, mi conexión con las estrellas es débil en este momento. ✨ Por favor intenta de nuevo.");
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].text.includes("conexión con las estrellas")) {
          return prev;
        }
        return [
          ...prev,
          {
            id: Date.now() + 1,
            text: "Lo siento, mi conexión con las estrellas es débil en este momento. ✨ Por favor intenta de nuevo.",
            sender: 'emyka'
          }
        ];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-[#1a052b]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#980d6b] to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/20">
                    EA
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a052b]"></div>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Emyka Astral</h3>
                  <p className="text-xs text-white/50 flex items-center gap-1">
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value as 'default' | 'formal')}
                  className="bg-transparent text-xs text-white/70 border border-white/10 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="default">Cercano</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-white/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-white/10 text-white rounded-tr-sm'
                        : 'bg-[#980d6b] text-white rounded-tl-sm shadow-lg'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              body: JSON.stringify({ message: userText }),
                <div className="flex justify-start">
                  <div className="bg-[#980d6b]/50 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
              {/* Sugerencia de reintento si hay error */}
              {lastError && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed bg-[#980d6b]/80 text-white rounded-tl-sm shadow-lg mt-2">
                    {lastError}
                    <button
                      className="block mt-2 underline text-white/80 hover:text-white font-medium text-xs"
                      onClick={() => handleSendMessage(true)}
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Input */}
            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Escribe tu duda..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-black/20 text-white placeholder-white/30 border border-white/10 rounded-full py-3 px-4 pr-12 focus:outline-none focus:border-[#980d6b]/50 focus:bg-black/40 transition-all text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-2 bg-[#980d6b] hover:bg-[#b01e7d] disabled:opacity-50 disabled:hover:bg-[#980d6b] text-white rounded-full transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#980d6b] hover:bg-[#b01e7d] text-white rounded-full shadow-[0_0_20px_rgba(152,13,107,0.5)] flex items-center justify-center border border-white/20 transition-all z-50 group"
      >
        <AnimatePresence mode='wait'>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-[#980d6b]"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
