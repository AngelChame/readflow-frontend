"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getQuizService } from "@/services/quiz.service";

export default function SummaryPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getQuizService(Number(id));
        setTitle(data.studySession.title);
        setSummary(data.studySession.summaryBody);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [id]);

  return (
    <main className="flex flex-col justify-between h-full p-5 md:p-10 bg-background-secondary rounded-2xl gap-2 md:gap-8">
      <div className="text-xl md:text-4xl font-bold">
        {loading ? "Cargando..." : title}
      </div>
      <div className="overflow-auto flex-1 min-h-0">
        <div className="text-foreground flex flex-col gap-4">
          {loading
            ? null
            : summary.split("\n\n").map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
        </div>
      </div>
      <div className="flex w-full justify-end-safe">
        <Link
          href={`/session/${Number(id)}/test`}
          className="bg-summary-button text-white py-2 md:py-4 px-10 md:px-16 rounded-2xl transition-all duration-300 hover:shadow-[0_5px_20px_rgba(30,31,53,0.7)] hover:scale-103 cursor-pointer"
        >
          Realizar evaluacion
        </Link>
      </div>
    </main>
  );
}
