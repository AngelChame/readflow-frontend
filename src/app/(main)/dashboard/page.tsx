export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-background-secondary p-6 rounded-2xl border border-border shadow-sm w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-foreground">
              Personaliza tu aprendizaje
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-8 justify-center mb-6">
          <select defaultValue="" className="text-base font-medium border border-border-secondary rounded-2xl px-4 py-2 text-foreground outline-none">
            <option value="" disabled>
              Selecciona el tipo de resumen
            </option>
            <option>Resumen fácil</option>
            <option>Resumen intermedio</option>
            <option>Resumen difícil</option>
          </select>
          <select defaultValue="" className="text-base font-medium border border-border-secondary rounded-2xl px-4 py-2 text-foreground outline-none">
            <option value="" disabled>
              Seleccione dificultad de la evaluación
            </option>
            <option>Fácil</option>
            <option>Intermedio</option>
            <option>Difícil</option>
          </select>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center h-40 w-1/2 bg-background-upload rounded-xl border-2 border-dashed border-black relative overflow-hidden">
            <span className="text-slate-400 text-sm font-medium">
              Subida de documentos pendiente...
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="bg-background-secondary p-6 rounded-2xl border border-border shadow-sm w-3/4 h-65">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-medium text-foreground">
                Análisis semanal
              </h3>
            </div>
        </div>
        </div> 
        <div className="bg-background-secondary p-6 rounded-2xl border border-border shadow-sm w-1/4 h-65">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-medium text-foreground">
                Días en racha
              </h3>
            </div>
        </div>
        </div> 
      </div> 
    </div>
  );
}