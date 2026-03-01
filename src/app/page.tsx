"use client";

import { Footer } from "@/components/organisms/landing/Footer";
import { HeroSection } from "@/components/organisms/landing/HeroSection";
import { HowItWorks } from "@/components/organisms/landing/HowItWorks";
import { Methodology } from "@/components/organisms/landing/Methodology";
import { Navbar } from "@/components/organisms/landing/Navbar";
import { QuizPreview } from "@/components/organisms/landing/QuizPreview";
import { TeamSection } from "@/components/organisms/landing/TeamSection";
import { motion } from "motion/react";

export default function Home() {
  return (
    <main className="bg-white overflow-x-hidden w-full relative">
      <Navbar />
      <HeroSection />

      {/* Sección Combinada: Cómo Funciona + QuizPreview */}
      <section className="relative w-full py-24 lg:py-32 flex items-center">
        <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">
          {/* Lado izquierdo */}
          <motion.div
            className="z-10 relative"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <HowItWorks />
          </motion.div>

          {/* Lado derecho: más grande y salido a la derecha */}
          <motion.div
            className="relative w-full flex justify-end"
            initial={{ opacity: 0, x: 200 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="w-[120%] lg:w-[130%] xl:w-[140%] transform translate-x-[15%] md:translate-x-[25%] scale-110 lg:scale-125 origin-center pointer-events-auto">
              <QuizPreview />
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
      >
        <Methodology />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.8,
          type: "spring",
          bounce: 0.4,
        }}
      >
        <TeamSection />
      </motion.div>
      <Footer />
    </main>
  );
}
