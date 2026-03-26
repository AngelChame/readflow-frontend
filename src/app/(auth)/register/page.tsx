"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { registerSchema } from "@/schemas/auth.schema";
import { authClient } from "@/lib/api/auth.client";
import { ApiError } from "@/types/api/auth/auth.types";
import { z } from "zod";
import TermsModal from "@/components/organisms/auth/TermsModal";
import { Eye, EyeOff } from "lucide-react";
import { AuthPanel } from "@/components/organisms/auth/AuthPanel";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [rootError, setRootError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: [] }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    if (!termsAccepted) return;

    const parsed = registerSchema.safeParse({
      username: form.username,
      email: form.email,
      password: form.password,
    });

    if (!parsed.success) {
      const tree = z.treeifyError(parsed.error);
      const errors: Record<string, string[]> = {};
      for (const [key, value] of Object.entries(tree.properties ?? {})) {
        errors[key] = value.errors ?? [];
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await authClient.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const error = err as ApiError;
      if (error.errors) {
        setFieldErrors(error.errors);
      } else {
        setRootError(error.message || "Error al crear la cuenta");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {isTermsModalOpen && (
        <TermsModal
          onClose={() => setIsTermsModalOpen(false)}
          onAccept={() => setTermsAccepted(true)}
        />
      )}

      <main className="md:py-6 px-4 md:px-10 bg-background min-h-screen w-full flex justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-[45%_45%] md:gap-[10%] items-center">
          <div className="grid grid-rows-[auto_1fr] gap-6 px-4 py-6 md:pl-30 md:pr-20 md:py-15 text-foreground self-center">
            {" "}
            <div className="flex flex-col gap-3.5">
              <h2 className="text-3xl md:text-5xl font-semibold">
                Crea tu cuenta
              </h2>
              <p className="text-lg font-light">
                Únete a ReadFlow y transforma cada lectura en un conocimiento
                permanente.
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label htmlFor="username" className="text-lg font-bold">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl h-9 pl-4"
                  placeholder="Tu nombre completo"
                  required
                />
                {fieldErrors.username?.[0] && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.username[0]}
                  </p>
                )}

                <label htmlFor="email" className="text-lg font-bold">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl h-10 pl-4"
                  placeholder="Ingresa tu correo"
                  required
                />
                {fieldErrors.email?.[0] && (
                  <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>
                )}

                <label htmlFor="password" className="text-lg font-bold">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-xl h-10 pl-4 pr-10 w-full"
                    placeholder="Crea una contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1">
                    {[
                      {
                        label: "Mínimo 8 caracteres",
                        met: form.password.length >= 8,
                      },
                      {
                        label: "Al menos una mayúscula",
                        met: /[A-Z]/.test(form.password),
                      },
                      {
                        label: "Al menos un número",
                        met: /[0-9]/.test(form.password),
                      },
                    ].map(({ label, met }) => (
                      <p
                        key={label}
                        className={`text-xs flex items-center gap-1.5 transition-colors duration-200 ${met ? "text-green-500" : "text-muted-foreground"}`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[9px] transition-colors duration-200 ${met ? "bg-green-500" : "bg-muted-foreground/30"}`}
                        >
                          {met ? "✓" : ""}
                        </span>
                        {label}
                      </p>
                    ))}
                  </div>
                )}
                {fieldErrors.password?.[0] && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.password[0]}
                  </p>
                )}

                {rootError && (
                  <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mt-2">
                    {rootError}
                  </p>
                )}

                {/* TyC */}
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 accent-[#5B6AEB] cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-foreground/70 select-none"
                  >
                    Acepto los{" "}
                    <button
                      type="button"
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-[#5B6AEB] font-medium underline underline-offset-2 hover:text-[#4a58d4] cursor-pointer bg-transparent border-none p-0 text-sm"
                    >
                      Términos y Condiciones
                    </button>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !termsAccepted}
                  className="text-lg py-4 px-10 bg-main-purple text-white font-bold rounded-xl mt-6 w-full self-center cursor-pointer transition-all hover:bg-main-purple duration-300 hover:shadow-[0_5px_20px_rgba(91,106,235,0.7)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </Button>
              </form>

              <div className="text-center">
                <h4 className="font-light text-foreground">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/login">
                    <Button
                      variant={"link"}
                      className="hover:text-shadow-[0_5px_20px_rgba(91,106,235,0.7)] px-1 font-bold text-main-purple hover:cursor-pointer text-base"
                    >
                      Inicia sesión
                    </Button>
                  </Link>
                </h4>
              </div>
            </div>
          </div>

          <div className="hidden md:block h-full">
            <AuthPanel subtitle="Mejoras tu retención" />
          </div>
        </div>
      </main>
    </>
  );
}
