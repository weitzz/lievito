'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useAuthStore } from "@/stores/authStore"
import { Button } from "../ui/button"
import { ArrowLeft } from "lucide-react"
import { LoginStepEmail } from "./loginStepEmail"
import { LoginSignup } from "./loginSignup"
import { getCookie } from "cookies-next/client"
import { LoginSignIn } from "./loginSignIn"

type Steps = "EMAIL" | "SIGNUP" | "SIGNIN"


export const LoginDialog = () => {
    const open = useAuthStore(state => state.open)
    const setOpen = useAuthStore(state => state.setOpen)
    const setToken = useAuthStore(state => state.setToken)
    const [step, setStep] = useState<Steps>('EMAIL')
    const [emailField, setEmailField] = useState('')


    useEffect(() => {
        const token = getCookie('token')
        if (token) setToken(token)
    }, [setToken])

    const handleStepEmail = (hasEmail: boolean, email: string) => {
        setEmailField(email)
        if (hasEmail) {
            setStep('SIGNIN')
        } else {
            setStep('SIGNUP')
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex  items-center gap-2">
                        {step !== "EMAIL" &&
                            <Button variant="ghost" size="icon" className="mr-2" onClick={() => setStep('EMAIL')}>
                                <ArrowLeft className="size-4" />
                            </Button>
                        }
                        {step === "EMAIL" && "Login / Cadastro"}
                        {step === "SIGNUP" && "Cadastro"}
                        {step === "SIGNIN" && "Login"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    {step === "EMAIL" && <LoginStepEmail onValidate={handleStepEmail} />}
                    {step === "SIGNUP" && <LoginSignup email={emailField} />}
                    {step === "SIGNIN" && <LoginSignIn email={emailField} />}
                </div>
            </DialogContent>
        </Dialog>
    )
}
