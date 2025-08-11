// src/components/BearTasky.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BearTasky = ({ mood = 'neutral', stats }) => {
  const moods = {
    happy: { eyes: "M -4 -1 Q 0 -3 4 -1", mouth: "M -6 5 Q 0 9 6 5", cheeks: true, message: "¡Excelente trabajo! ¡Sigue así!", title: "¡Felicidades!", color: "#4ADE80" },
    neutral: { eyes: "M -4 0 L 4 0", mouth: "M -5 6 L 5 6", cheeks: false, message: "Un nuevo día, nuevas oportunidades.", title: "¡Hola de nuevo!", color: "#60A5FA" },
    angry: { eyes: "M -4 -2 L -1 1 M 1 1 L 4 -2", mouth: "M -6 6 Q 0 2 6 6", cheeks: false, message: "¡El tiempo vuela! ¡Vamos a por ello!", title: "¡Atención!", color: "#F87171" },
  };

  const currentMood = moods[mood] || moods.neutral;
  const progressPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg sticky top-8">
      <div className="flex flex-col items-center text-center">
        
        <div className="w-28 h-28 mb-4">
          <motion.svg
            key={mood}
            viewBox="-15 -15 30 30"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {/* Partes del oso */}
            <circle cx="-8" cy="-8" r="4" fill="#64748B" />
            <circle cx="8" cy="-8" r="4" fill="#64748B" />
            <circle cx="0" cy="0" r="12" fill="#94A3B8" />
            <path d="M -8 1 C -8 6, 8 6, 8 1 L 5 0 C 5 -2, -5 -2, -5 0 Z" fill="#E2E8F0"/>
            
            {/* Rasgos faciales */}
            <g transform="translate(0, -2)">
              <motion.path d={currentMood.eyes} transform="translate(-6, 0)" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" initial={false} animate={{ d: currentMood.eyes }}/>
              <motion.path d={currentMood.eyes} transform="translate(6, 0)" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" initial={false} animate={{ d: currentMood.eyes }}/>
              <path d="M -1.5 2 L 1.5 2 Q 2.5 4, 0 4 Q -2.5 4, -1.5 2 Z" fill="#1E293B" />
              <motion.path d={currentMood.mouth} stroke="#1E293B" strokeWidth="1" strokeLinecap="round" initial={false} animate={{ d: currentMood.mouth }}/>
              <AnimatePresence>
                {currentMood.cheeks && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <circle cx="-7" cy="3" r="1.5" fill={currentMood.color} opacity="0.6"/>
                    <circle cx="7" cy="3" r="1.5" fill={currentMood.color} opacity="0.6"/>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          </motion.svg>
        </div>

        <h3 className="font-bold text-xl" style={{ color: currentMood.color }}>{currentMood.title}</h3>
        <p className="text-sm text-slate-400 h-10">{currentMood.message}</p>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-slate-400 mb-1">
          <span>Progreso de Hoy</span>
          <span>{stats.completed}/{stats.total}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <motion.div
            className="h-2.5 rounded-full"
            style={{ backgroundColor: currentMood.color }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default BearTasky;