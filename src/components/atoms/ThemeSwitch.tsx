"use client"; // 1. Indica que es interactivo

import { useState } from 'react';

export default function ThemeSwitch() {
  // 2. Definimos el estado (por defecto 'false' = modo claro)
  const [isDark, setIsDark] = useState(false);

  // 3. Función para cambiar el estado al hacer clic
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="flex flex-col items-center gap-2">

      {/* 4. Al hacer clic en la pista, ejecutamos toggleTheme */}
      <div 
        onClick={toggleTheme}
        className={`w-14 h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 border ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-black border-black'
        }`}
      >
        {/* 5. El círculo indicador se mueve según el estado isDark */}
        <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 transform ${
          isDark ? 'translate-x-7 bg-indigo-500' : 'translate-x-0 bg-[#3B82F6]'
        }`}>
          <span className="text-[10px]">{isDark ? '🌙' : '☀️'}</span>
        </div>
      </div>
    </div>
  );
}