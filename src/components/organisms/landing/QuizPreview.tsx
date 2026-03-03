"use client";

import { useState } from "react";

const quizOptions = [
  { id: 0, text: "La ansiedad siempre es positiva" },
  { id: 1, text: "El miedo solo es psicológico" },
  { id: 2, text: "El miedo responde a un peligro real inmediato" },
  { id: 3, text: "La ansiedad nunca responde al cuerpo" },
];

export function QuizPreview() {
  const [selectedOption, setSelectedOption] = useState<number>(2);

  return (
    <div className="w-full flex justify-center pointer-events-auto">
      <div className="bg-[#eaeaea] rounded-2xl border border-black w-full max-w-3xl p-8 rotate-[-2deg] shadow-2xl">
        {/* Header del quiz */}
        <div className="mb-6">
          <h2 className="font-semibold text-black text-2xl">
            Test - Opción Múltiple
          </h2>
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-6">
          <div>
            <h3 className="font-medium text-xl text-black">La Ansiedad</h3>
            <p className="text-sm text-black mt-1">Pregunta 1 de 10</p>
          </div>

          <h4 className="font-medium text-xl text-black">
            ¿Cuál es la diferencia principal entre miedo y ansiedad?
          </h4>

          <fieldset className="flex flex-col gap-3 border-none p-0 m-0">
            <legend className="sr-only">Opciones de respuesta</legend>
            {quizOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center h-14 px-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? "bg-[#5b6aeb66] border-[#5b6aeb] shadow-[0_0_14px_#5b6aeb]"
                    : "bg-white border-black"
                }`}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="sr-only"
                />
                <span className="font-medium text-black text-base">
                  {option.text}
                </span>
              </label>
            ))}
          </fieldset>

          <div className="flex justify-between">
            <button
              type="button"
              className="w-40 h-11 rounded-xl border border-[#1e1f35] text-[#1e1f35] font-medium hover:bg-gray-50 transition-colors"
            >
              Regresar
            </button>
            <button
              type="button"
              className="w-40 h-11 rounded-xl bg-[#1e1f35] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
