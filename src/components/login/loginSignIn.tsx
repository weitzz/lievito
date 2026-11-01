'use client'
import { useAuthStore } from '@/stores/authStore'
import React, { useState } from 'react'
import { CustomInput } from '../layout/customInput'
import { loginSchema } from '@/lib/validations'
import { api } from '@/lib/axios'
import { Button } from '../ui/button'
import type { FieldErrors } from '@/lib/utils'

type Props = {
    email: string

}


export const LoginSignIn = ({ email }: Props) => {
    const auth = useAuthStore()
    const [errors, setErrors] = useState<FieldErrors>(null)
    const [loading, setLoading] = useState(false)
    const [emailField, setEmailField] = useState(email)
    const [passwordField, setPasswordField] = useState('')



    const handleButton = async () => {
        setErrors(null)
        const validData = loginSchema.safeParse({
            email: emailField,
            password: passwordField,
        })
        if (!validData.success) {
            setErrors(validData.error.flatten().fieldErrors)
            return false
        }
        try {
            setLoading(true)
            const signinReq = await api.post('/auth/signin', {
                email: validData.data.email,
                password: validData.data.password,

            })
            setLoading(false)
            if (!signinReq.data.token) {
                alert(signinReq.data.error)
            } else {
                auth.setToken(signinReq.data.token)
                auth.setOpen(false)
            }

        } catch {
            setLoading(false)
        }


    }
    return (
        <>
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
            <Button disabled={loading} onClick={handleButton}>Entrar</Button>
        </>
    )
}
