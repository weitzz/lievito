import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3, "Nome muito curto"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha precisa de pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "A senha precisa de pelo menos 6 caracteres")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem ",
    path: ['confirmPassword']
})

export const validateEmailSchema = z.object({
    email: z.string().email({ message: "Email inválido" })
})



export const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Campo obrigatório"),
});

export type ValidateEmailSchema = z.infer<typeof validateEmailSchema>

export type LoginSchema = z.infer<typeof loginSchema>

export type RegisterSchema = z.infer<typeof registerSchema>;


