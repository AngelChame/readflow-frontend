"use client";

import { useEffect, useRef, useState } from "react";
import { X, FileText, Info, ChevronDown } from "lucide-react";

interface TermsModalProps {
    onClose: () => void;
    onAccept: () => void;
}

export default function TermsModal({ onClose, onAccept }: TermsModalProps) {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleScroll = () => {
        const el = contentRef.current;
        if (!el) return;
        if (el.scrollHeight - el.scrollTop <= el.clientHeight + 40) {
            setHasScrolledToBottom(true);
        }
    };

    const handleAccept = () => {
        onAccept();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 zoom-in-95 duration-200">

                <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#5B6AEB]/10 flex items-center justify-center text-[#5B6AEB] flex-shrink-0">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h2 id="terms-title" className="text-base font-semibold text-foreground leading-tight">
                                Términos y Condiciones
                            </h2>
                            <p className="text-xs text-muted-foreground mt-px">Versión 1.0 · Marzo 2026</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {!hasScrolledToBottom && (
                    <div className="flex items-center gap-2 px-6 py-2 bg-[#5B6AEB]/5 border-b border-[#5B6AEB]/15 text-[#5B6AEB] text-xs flex-shrink-0">
                        <Info size={13} />
                        Lee el documento completo para poder aceptar
                        <ChevronDown size={13} className="ml-auto animate-bounce" />
                    </div>
                )}

                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="overflow-y-auto flex-1 px-6 py-5 space-y-6 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
                >
                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            1. Identificación del Proyecto
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                            ReadFlow es una plataforma web de carácter experimental, desarrollada de manera independiente por estudiantes universitarios con el propósito de validar una hipótesis en el ámbito de la psicología cognitiva aplicada a la educación superior. Este proyecto no constituye un producto comercial, no opera bajo ninguna figura jurídica empresarial y no representa, ni actúa en nombre de, institución educativa alguna. La universidad de adscripción de sus desarrolladores no asume responsabilidad alguna sobre el funcionamiento, contenido, decisiones técnicas ni tratamiento de datos de esta plataforma.
                        </p>
                    </section>

                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            2. Objeto
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                            Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma ReadFlow, así como la participación voluntaria en el estudio experimental que esta sustenta. El estudio tiene como propósito evaluar si la combinación de resúmenes generados mediante inteligencia artificial, evaluaciones de desempeño inmediato y repetición espaciada produce un incremento estadísticamente significativo en la retención de información en estudiantes universitarios.
                        </p>
                    </section>

                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            3. Participación Voluntaria
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                            La participación en el estudio es estrictamente voluntaria. El usuario podrá retirarse en cualquier momento sin que ello genere consecuencia académica, técnica o de cualquier otra naturaleza. El retiro del consentimiento no afectará el acceso a la plataforma durante el tiempo que esta permanezca activa.
                        </p>
                    </section>

                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            4. Datos Recopilados
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">Durante el uso de la plataforma, ReadFlow recopilará la siguiente información:</p>
                        <ul className="mt-2 space-y-1.5 pl-4 list-disc">
                            <li className="text-sm text-foreground leading-relaxed">
                                <span className="font-semibold">Datos de identificación:</span> nombre de usuario y dirección de correo electrónico.
                            </li>
                            <li className="text-sm text-foreground leading-relaxed">
                                <span className="font-semibold">Documentos aportados:</span> archivos en formato PDF subidos por el usuario para su procesamiento por parte del sistema de inteligencia artificial.
                            </li>
                            <li className="text-sm text-foreground leading-relaxed">
                                <span className="font-semibold">Datos de desempeño:</span> resultados obtenidos en las evaluaciones inmediatas (T0) y diferidas (T48h), así como métricas de interacción derivadas del uso de la plataforma.
                            </li>
                        </ul>
                    </section>

                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            5. Tratamiento y Uso de la Información
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                            Los datos recopilados serán tratados <strong>exclusivamente con fines de investigación académica</strong>, conforme a los siguientes principios:
                        </p>
                        <div className="rounded-xl p-4 bg-[#5B6AEB]/5 border border-[#5B6AEB]/15 space-y-2">
                            <p className="text-xs font-semibold text-foreground">El equipo de ReadFlow se compromete a:</p>
                            <ul className="space-y-1.5 pl-4 list-disc">
                                <li className="text-sm text-foreground leading-relaxed">Utilizar la información únicamente para el análisis, validación y publicación de resultados del estudio experimental.</li>
                                <li className="text-sm text-foreground leading-relaxed">Publicar los resultados de manera <strong>agregada y anonimizada</strong>, garantizando que ningún participante sea identificable.</li>
                                <li className="text-sm text-foreground leading-relaxed">Implementar medidas de seguridad técnicas razonables para proteger la integridad y confidencialidad de los datos.</li>
                            </ul>
                        </div>
                        <div className="rounded-xl p-4 bg-red-500/5 border border-red-500/15 space-y-2">
                            <p className="text-xs font-semibold text-foreground">ReadFlow prohíbe expresamente:</p>
                            <ul className="space-y-1.5 pl-4 list-disc">
                                <li className="text-sm text-foreground leading-relaxed">La venta, cesión, arrendamiento o cualquier forma de comercialización de datos personales o de desempeño.</li>
                                <li className="text-sm text-foreground leading-relaxed">El uso de la información con fines publicitarios, de perfilamiento comercial o ajenos al propósito académico declarado.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            6. Supervisión Académica y Acceso Institucional
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                            En virtud del carácter académico del proyecto, los datos recopilados podrán ser revisados, en forma <strong>anonimizada o agregada</strong>, por asesores académicos o por la institución universitaria en el contexto de la supervisión metodológica del estudio. Dicho acceso tiene como único fin verificar el rigor científico de la investigación y no implica que la institución ostente titularidad sobre los datos, ni responsabilidad alguna sobre su tratamiento o sobre la operación de la plataforma.
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                            Adicionalmente, la institución universitaria supervisora podrá <strong>solicitar el análisis detallado o la eliminación total de los datos recopilados</strong>, cuando así lo determine necesario por razones metodológicas, éticas o institucionales. ReadFlow ejecutará dicha solicitud en el menor tiempo posible, notificando a los usuarios afectados cuando sea técnicamente viable.
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                            Bajo ninguna circunstancia los datos serán compartidos con la institución de forma individualizada o identificable para fines distintos a la validación académica del estudio, ni serán vendidos, cedidos o comercializados a tercero alguno.
                        </p>
                    </section>

                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            7. Derechos del Usuario
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">El usuario titular de los datos tendrá derecho a:</p>
                        <ul className="mt-2 space-y-1.5 pl-4 list-disc">
                            <li className="text-sm text-foreground leading-relaxed"><span className="font-semibold">Acceso:</span> solicitar información sobre los datos asociados a su cuenta.</li>
                            <li className="text-sm text-foreground leading-relaxed"><span className="font-semibold">Rectificación:</span> corregir datos incorrectos o desactualizados.</li>
                            <li className="text-sm text-foreground leading-relaxed"><span className="font-semibold">Cancelación:</span> solicitar la eliminación de su cuenta y los datos vinculados a ella.</li>
                            <li className="text-sm text-foreground leading-relaxed"><span className="font-semibold">Oposición:</span> retirar su consentimiento y solicitar que sus datos no sean utilizados en el análisis del estudio.</li>
                        </ul>
                        <p className="text-sm text-foreground leading-relaxed">
                            El ejercicio de estos derechos podrá realizarse mediante solicitud formal a través de los canales de contacto habilitados en la plataforma.
                        </p>
                    </section>

                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            8. Declaración de Mayoría de Edad
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                            Al completar el proceso de registro, el usuario declara, bajo su responsabilidad, tener <strong>dieciocho (18) años de edad o más</strong>, o contar con la autorización de un representante legal en caso de que la legislación aplicable en su jurisdicción así lo exija.
                        </p>
                    </section>

                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            9. Limitación de Responsabilidad
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                            ReadFlow es un proyecto en etapa de desarrollo experimental (MVP). La plataforma se pone a disposición del usuario <strong>en su estado actual</strong>, sin garantías explícitas ni implícitas de disponibilidad continua, exactitud de los resultados generados por inteligencia artificial, o preservación indefinida de los datos almacenados. El equipo de ReadFlow no será responsable por daños directos o indirectos derivados de interrupciones del servicio, pérdidas de datos por fallas técnicas o decisiones tomadas con base en los contenidos generados por la plataforma.
                        </p>
                    </section>

                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            10. Modificaciones
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                            El equipo de ReadFlow se reserva el derecho de modificar los presentes Términos y Condiciones en cualquier momento durante el período de vigencia del servicio. Las modificaciones serán notificadas a través de la plataforma y entrarán en vigor desde su publicación. El uso continuado de la plataforma tras dicha notificación implicará la aceptación de los términos actualizados.
                        </p>
                    </section>

                    <section className="pb-6 border-b border-border/60 space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            11. Vigencia del Servicio y Duración del Estudio
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                            ReadFlow opera como plataforma de soporte a un estudio experimental con una <strong>duración definida de treinta (30) días naturales</strong>, contados a partir de la fecha oficial de despliegue del sistema.
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">Al término de dicho período:</p>
                        <ul className="mt-2 space-y-1.5 pl-4 list-disc">
                            <li className="text-sm text-foreground leading-relaxed">El acceso a la plataforma será <strong>cerrado de forma definitiva</strong>.</li>
                            <li className="text-sm text-foreground leading-relaxed">Los datos recopilados serán conservados exclusivamente para el análisis e informe final de la investigación, conforme a lo establecido en la Sección 5.</li>
                            <li className="text-sm text-foreground leading-relaxed">El servicio <strong>no garantiza reapertura ni continuidad</strong> una vez concluido el período experimental.</li>
                        </ul>
                        <p className="text-sm text-foreground leading-relaxed">
                            Se recomienda al usuario completar su participación dentro del período activo, ya que no será posible acceder a sus resultados ni métricas una vez cerrada la plataforma.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#5B6AEB]">
                            12. Aceptación del Consentimiento Informado
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                            Al seleccionar la opción <strong>&#34;Acepto los Términos y Condiciones&#34;</strong> durante el proceso de registro, el usuario manifiesta de forma expresa que:
                        </p>
                        <ol className="mt-2 space-y-1.5 pl-4 list-decimal">
                            <li className="text-sm text-foreground leading-relaxed">Ha leído íntegramente y comprendido el contenido de los presentes Términos y Condiciones.</li>
                            <li className="text-sm text-foreground leading-relaxed">Consiente voluntariamente su participación en el estudio experimental descrito.</li>
                            <li className="text-sm text-foreground leading-relaxed">Autoriza el tratamiento de sus datos personales y de desempeño conforme a lo establecido en este documento.</li>
                            <li className="text-sm text-foreground leading-relaxed">Comprende que su participación es voluntaria y que puede retirarse en cualquier momento.</li>
                            <li className="text-sm text-foreground leading-relaxed">Reconoce que el servicio tiene una vigencia limitada de treinta (30) días y que al término de dicho período el acceso será clausurado sin garantía de reapertura.</li>
                        </ol>
                    </section>
                </div>

                <div className="px-6 py-4 border-t border-border flex-shrink-0 bg-background">
                    {!hasScrolledToBottom && (
                        <p className="text-xs text-muted-foreground text-center mb-3">
                            Desplázate hasta el final para habilitar el botón de aceptación
                        </p>
                    )}
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleAccept}
                            disabled={!hasScrolledToBottom}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#5B6AEB] text-white transition-all cursor-pointer hover:bg-[#4a58d4] hover:shadow-[0_4px_12px_rgba(91,106,235,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            Acepto los Términos y Condiciones
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}