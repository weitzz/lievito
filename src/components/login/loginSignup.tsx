'use client'

import { useAuthStore } from "@/stores/authStore"
import { useState } from "react"
import { registerSchema } from '@/lib/validations'
import { api } from "@/lib/axios"
import { CustomInput } from "../layout/customInput"
import { Button } from "../ui/button"
import type { FieldErrors } from "@/lib/utils"
type Props = {
    email: string

}

export const LoginSignup = ({ email }: Props) => {
    const auth = useAuthStore()
    const [errors, setErrors] = useState<FieldErrors>(null)
    const [loading, setLoading] = useState(false)
    const [nameField, setNameField] = useState('')
    const [emailField, setEmailField] = useState(email)
    const [passwordField, setPasswordField] = useState('')
    const [passwordConfirmField, setPasswordConfirmField] = useState('')

    const handleButton = async () => {
        setErrors(null)
        const validData = registerSchema.safeParse({
            name: nameField,
            email: emailField,
            password: passwordField,
            confirmPassword: passwordConfirmField
        })
        if (!validData.success) {
            setErrors(validData.error.flatten().fieldErrors)
            return false
        }
        try {
            setLoading(true)
            const signupReq = await api.post('/auth/signup', {
                name: validData.data.name,
                email: validData.data.email,
                password: validData.data.password,

            })
            setLoading(false)
            if (!signupReq.data.token) {
                alert(signupReq.data.error)
            } else {
                auth.setToken(signupReq.data.token)
                auth.setOpen(false)
            }

        } catch {
            setLoading(false)
        }


    }

    return (
        <>
            <div>
                <p className="mb-2">Digite seu Nome</p>
                <CustomInput name="name"
                    errors={errors}
                    disabled={loading}
                    type="text"
                    autoFocus
                    value={nameField}
                    onChange={e => setNameField(e.target.value)} />
            </div>

            <div>
                <p className="mb-2">Digite seu Email</p>
                <CustomInput name="email"
                    errors={errors}
                    disabled={loading}
                    type="email"
                    value={emailField}
                    onChange={e => setEmailField(e.target.value)} />
            </div>
            <div>
                <p className="mb-2">Digite sua Senha</p>
                <CustomInput name="password"
                    errors={errors}
                    disabled={loading}
                    type="password"
                    autoFocus
                    value={passwordField}
                    onChange={e => setPasswordField(e.target.value)} />
            </div>

            <div>
                <p className="mb-2">Repita sua Senha</p>
                <CustomInput name="passwordConfirm"
                    errors={errors}
                    disabled={loading}
                    type="password"
                    autoFocus
                    value={passwordConfirmField}
                    onChange={e => setPasswordConfirmField(e.target.value)} />
            </div>
            <Button disabled={loading} onClick={handleButton}>Cadastrar</Button>
        </>
    )
}
