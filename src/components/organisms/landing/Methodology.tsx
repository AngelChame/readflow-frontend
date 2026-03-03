const steps = [
  {
    number: "1",
    title: "Cargar un documento",
    description:
      "ReadFlow genera el material de estudio, tú seleccionas la dificultad y el tipo de evaluación deseada.",
  },
  {
    number: "2",
    title: "Ciclo de Evaluación",
    description:
      "Una vez estés preparado podrás realizar tu evaluación inmediata y a las próximas 48hrs tu evaluación espaciada.",
  },
  {
    number: "3",
    title: "Porcentaje de retención",
    description:
      "Cuando hayas completado tus dos evaluaciones podrás visualizar tu porcentaje de retención.",
  },
];

export function Methodology() {
  return (
    <section
      id="metodologia"
      className="w-full py-24 px-6"
      style={{
        background:
          "radial-gradient(50% 50% at 50% 50%, #5B6AEB 0%, #404A9F 100%)",
      }}
    >
      <h2 className="text-white font-bold text-5xl text-center mb-16">
        Metodología
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.number}
            className="relative bg-white/20 rounded-3xl p-8 flex flex-col gap-4"
          >
            {/* Contenedor del número con efecto de blur desvanecido desde abajo */}
            <div
              className="relative font-black text-8xl select-none leading-none mb-2"
              aria-hidden="true"
            >
              {/* Texto superior (Nítido, se desvanece hacia la mitad) */}
              <span
                className="relative block text-white"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 20%, transparent 70%)",
                  maskImage:
                    "linear-gradient(to bottom, black 20%, transparent 70%)",
                }}
              >
                {step.number}
              </span>
              {/* Texto inferior (Con Blur, aparece desde la mitad hacia abajo) */}
              <span
                className="absolute inset-0 text-white blur-[3px]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 10%, black 60%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 10%, black 60%)",
                }}
              >
                {step.number}
              </span>
            </div>
            <h3 className="font-bold text-white text-2xl">{step.title}</h3>
            <p className="text-white text-base leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
