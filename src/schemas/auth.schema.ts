import {infer, string, z} from "zod";

export const loginSchema = z.object({
    email: z.email("Email invalido"),
    password: z.string().min(8, "Minimo 8 caracteres")
})

export const registerSchema = z.object({
    name: z.string().min(3, "Minimo 3 caracteres"),
    email: z.email("Email invalido"),
    password: z.string().min(8, "Minimo 8 caracteres"),
})

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;