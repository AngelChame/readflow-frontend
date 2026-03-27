"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DropZone from "@/components/molecules/DropZone";
import DashboardSelects from "@/components/molecules/DashboardSelects";
import { createStudySessionService } from "@/services/quiz.service";
import type { CatalogsData } from "@/types/api/catalogs.types";

interface DashboardFormProps {
  catalogs: CatalogsData;
}

export default function DashboardForm({ catalogs }: DashboardFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [difficultyId, setDifficultyId] = useState<number | null>(null);
  const [evaluationTypeId, setEvaluationTypeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo PDF.");
      return;
    }
    if (!difficultyId) {
      setError("Por favor selecciona la dificultad de la evaluación.");
      return;
    }
    if (!evaluationTypeId) {
      setError("Por favor selecciona el tipo de evaluación.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await createStudySessionService(
        file,
        difficultyId,
        evaluationTypeId,
      );
      router.push(`/session/${result.studySession.id}/summary`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al procesar el documento.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className=" h-full flex flex-col justify-around">
      <DashboardSelects
        difficulties={catalogs.difficulties}
        evaluationTypes={catalogs.evaluationTypes}
        onDifficultyChange={setDifficultyId}
        onEvaluationTypeChange={setEvaluationTypeId}
      />

      <div className="flex items-center justify-center w-full">
        <DropZone onFileSelected={setFile} />
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium text-center mt-2">
          {error}
        </p>
      )}

      <div className="flex items-center justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="text-lg py-2 px-10 bg-blue-700 text-white font-bold rounded-xl w-fit self-center cursor-pointer transition-all duration-300 hover:shadow-[0_5px_20px_rgba(91,106,235,0.7)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
        >
          {loading ? "Procesando..." : "Generar"}
        </button>
      </div>
    </div>
  );
}
