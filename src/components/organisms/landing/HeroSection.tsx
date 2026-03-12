"use client";

import { Particles } from "@/components/ui/particles";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{
        background:
          "radial-gradient(50% 50% at 50% 50%, #5B6AEB 0%, #404A9F 100%)",
      }}
    >
      {/* Componente de Partículas (Fondo Animado) */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={120}
        ease={80}
        color="#ffffff"
        refresh
      />

      {/* Glow blur de fondo */}
      <div
        className="absolute inset-0 blur-[40px] opacity-80 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, #5B6AEB 0%, #404A9F 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl">
        <h1 className="text-white font-bold text-7xl md:text-[120px] leading-none drop-shadow-[0_0_20px_#ffffff]">
          ReadFlow
        </h1>

        <p className="text-white text-xl text-center">
          Con <strong>ReadFlow</strong> lee una vez, apréndelo para siempre.
        </p>

          <Link href={"/login"} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-3xl shadow-[0_0_33px_#ffffff70] text-black text-xl transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white">
            <span>Accede ahora →</span>
          </Link>
      </div>
    </section>
  );
}
