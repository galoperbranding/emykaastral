"use client";
import { motion } from 'framer-motion';

const messages = [
  { id: 1, text: "Siento que no tengo disciplina y nada me sale bien...", sender: "user" },
  { id: 2, text: "Te escucho. No es falta de disciplina, es que tu Marte actúa diferente. Déjame explicarte cómo fluyes tú.", sender: "emyka" },
];

export default function EmpathyChat() {
  return (
    <div className="flex flex-col space-y-4 w-full max-w-sm bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-8 h-8 bg-emyka rounded-full flex items-center justify-center text-[10px] font-bold">EA</div>
        <span className="text-[10px] uppercase tracking-widest text-gray-400">Emyka - AI Guide</span>
      </div>
      {messages.map((msg, i) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 1 }}
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`p-4 rounded-2xl text-xs ${
            msg.sender === 'user' ? 'bg-white/10 text-gray-300' : 'bg-[#980d6b] text-white'
          }`}>
            {msg.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}