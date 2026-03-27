"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { loginSchema } from "@/schemas/auth.schema";
import { loginService } from "@/services/auth.service";
import { ApiError } from "@/services/api.service";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { AuthPanel } from "@/components/organisms/auth/AuthPanel";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [rootError, setRootError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: [] }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const parsed = loginSchema.safeParse(form);
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
      await loginService(form.email, form.password);
      const redirect = searchParams.get("redirect");
      const isSafe = redirect?.startsWith("/") && !redirect.startsWith("//");
      router.push(isSafe ? redirect! : "/dashboard");
    } catch (err: unknown) {
      const error = err as ApiError;
      if (error.errors) {
        setFieldErrors(error.errors);
      } else {
        setRootError(error.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="md:py-6 px-4 md:px-10 bg-background min-h-screen w-full flex justify-center">
      <div className="w-full grid grid-cols-1 md:grid-cols-[45%_45%] md:gap-[10%]">
        <div className="hidden md:block">
          <AuthPanel subtitle="Mejoras cada día" />
        </div>

        <div className="w-full grid grid-rows-[auto_1fr] gap-6 px-4 py-6 md:pl-20 md:pr-16 md:py-24 text-foreground self-center">
          <div className="flex flex-col gap-3.5">
            <h2 className="text-3xl md:text-5xl font-semibold">
              Inicia sesión
            </h2>
            <p className="text-lg font-light">
              Bienvenido de nuevo. Mantén tu racha y sigue optimizando tu
              retención cognitiva.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
                className="border border-gray-300 rounded-xl h-10 pl-4 w-full"
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
                  placeholder="Ingresa tu contraseña"
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

              <Button
                type="submit"
                disabled={loading}
                className="text-lg bg-main-purple text-white font-bold rounded-xl mt-8 w-full self-center cursor-pointer transition-all duration-300 hover:shadow-[0_5px_20px_rgba(91,106,235,0.7)] hover:scale-[1.02] hover:bg-main-purple"
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>

            <div className="text-center">
              <h4 className="font-light text-foreground">
                ¿Aún no tienes una cuenta?{" "}
                <Link href="/register">
                  <Button
                    variant={"link"}
                    className="font-bold text-main-purple px-1 hover:cursor-pointer text-base"
                  >
                    Regístrate
                  </Button>
                </Link>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
