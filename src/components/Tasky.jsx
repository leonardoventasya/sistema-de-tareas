// src/components/Tasky.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Tasky = ({ mood = 'neutral', stats }) => {
  const facialFeatures = {
    happy: { eyes: "M 8 12 Q 12 10 16 12", mouth: "M 8 18 Q 12 22 16 18", color: "#4ADE80" },
    neutral: { eyes: "M 8 12 Q 12 13 16 12", mouth: "M 8 18 L 16 18", color: "#60A5FA" },
    angry: { eyes: "M 8 14 L 11 11 M 13 11 L 16 14", mouth: "M 8 20 Q 12 16 16 20", color: "#F87171" },
  };

  const messages = {
    happy: "¡Excelente trabajo! ¡Sigue así!",
    neutral: "Un nuevo día, nuevas oportunidades.",
    angry: "¡El tiempo vuela! ¡Vamos a por ello!",
  };

  const { eyes, mouth, color } = facialFeatures[mood] || facialFeatures.neutral;
  const message = messages[mood] || messages.neutral;
  const progressPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg sticky top-8">
      <div className="flex items-center gap-4">
        <motion.div
          key={mood} // Forzar re-animación cuando cambia el humor
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
            <motion.path d={eyes} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" initial={false} animate={{ d: eyes }} transition={{ duration: 0.3 }}/>
            <motion.path d={mouth} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" initial={false} animate={{ d: mouth }} transition={{ duration: 0.3 }}/>
          </svg>
        </motion.div>
        <div>
          <p className="font-semibold text-lg">{mood === 'happy' ? '¡Felicidades!' : (mood === 'angry' ? '¡Atención!' : '¡Hola!')}</p>
          <p className="text-sm text-slate-400">{message}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between text-sm text-slate-400 mb-1">
          <span>Progreso de Hoy</span>
          <span>{stats.completed}/{stats.total}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <motion.div
            className="bg-blue-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasky;