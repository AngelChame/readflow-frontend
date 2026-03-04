'use client';

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { registerSchema } from "@/schemas/auth.schema";
import { authClient } from "@/lib/api/auth.client";
import { ApiError } from "@/types/api/auth/auth.types";
import {z} from "zod";

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

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setFieldErrors((prev) => ({ ...prev, [e.target.name]: [] }));
    }

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setFieldErrors({});
        setRootError(null);

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
        <main className="py-6 px-10 bg-background min-h-screen w-full h-full flex justify-center">
            <div className="w-full grid grid-cols-[45%_45%] gap-[10%] items-center">

                <div className="grid grid-rows-[auto_1fr] gap-10 pl-30 pr-20 py-24 text-foreground self-center">
                    <div className="flex flex-col gap-3.5">
                        <h2 className="text-5xl font-semibold">Crea tu cuenta</h2>
                        <p className="text-lg font-light">Únete a ReadFlow y transforma cada lectura en un conocimiento permanente.</p>
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
                                className="border border-gray-300 rounded-xl h-10 pl-4"
                                placeholder="Tu nombre completo"
                                required
                            />
                            {fieldErrors.username?.[0] && (
                                <p className="text-sm text-red-500">{fieldErrors.username[0]}</p>
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
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-xl h-10 pl-4"
                                placeholder="Crea una contraseña"
                                required
                            />
                            {fieldErrors.password?.[0] && (
                                <p className="text-sm text-red-500">{fieldErrors.password[0]}</p>
                            )}

                            {rootError && (
                                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mt-2">
                                    {rootError}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="text-lg py-4 px-10 bg-main-purple text-white font-bold rounded-xl mt-8 w-full self-center cursor-pointer transition-all hover:bg-main-purple duration-300 hover:shadow-[0_5px_20px_rgba(91,106,235,0.7)]"
                            >
                                {loading ? "Creando cuenta..." : "Crear cuenta"}
                            </Button>
                        </form>

                        <div className="text-center">
                            <h4 className="font-light text-foreground">
                                ¿Ya tienes una cuenta?{" "}
                                <Link href="/login">
                                    <Button variant={"link"} className="hover:text-shadow-[0_5px_20px_rgba(91,106,235,0.7)] px-1 font-bold text-main-purple hover:cursor-pointer text-base">
                                        Inicia sesión
                                    </Button>
                                </Link>
                            </h4>
                        </div>
                    </div>
                </div>

                <BubbleBackground interactive={true} colors={{ first: "14,23,102", second: "18,29,173", third: "91,138,210", fourth: "101,136,226", fifth: "51,96,187", sixth: "79,187,233" }} className="rounded-3xl h-full w-full flex flex-col justify-between px-10 py-16 shadow-[0_5px_30px_rgba(91,106,235,0.6)]">
                    <div className="flex flex-col gap-3.5 text-white z-10">
                        <h3 className="text-xl font-light">Con nosotros</h3>
                        <h2 className="text-3xl font-bold">Mejoras tu retención</h2>
                    </div>
                    <div className="flex flex-col items-center gap-6 w-full h-fit justify-center text-white z-10">
                        <h2 className="text-4xl font-bold">ReadFlow</h2>
                        <img src="/logo/logo.svg" alt="" className="z-10 w-16" />
                    </div>
                </BubbleBackground>

            </div>
        </main>
    );
}