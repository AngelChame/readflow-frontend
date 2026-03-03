const sections = [
  {
    title: "El problema:",
    content:
      "La ciencia lo confirma: la lectura pasiva de textos académicos provoca que los estudiantes pierdan hasta el 50% de la información en solo 24 horas debido a la Curva del Olvido. Estás perdiendo tiempo valioso de estudio y sacrificando tu verdadero potencial de retención cognitiva.",
  },
  {
    title: "La solución:",
    content:
      "ReadFlow rompe este ciclo transformando tus textos estáticos en un entrenamiento mental dinámico. Al subir tus documentos, nuestra Inteligencia Artificial genera resúmenes estructurados y cuestionarios interactivos al instante.",
  },
];

export function HowItWorks() {
  return (
    <div id="como-funciona" className="w-full">
      <h2 className="font-bold text-black text-5xl md:text-7xl mb-12 leading-none">
        CÓMO
        <br />
        FUNCIONA
      </h2>

      <div className="flex flex-col gap-12 max-w-2xl">
        {sections.map((section, index) => (
          <article key={index} className="flex flex-col gap-6">
            <h3 className="font-bold text-black text-2xl">{section.title}</h3>
            <p className="text-black text-xl text-justify leading-relaxed">
              {section.content}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
