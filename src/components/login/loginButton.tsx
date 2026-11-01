'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { ClipboardList, LogOut, UserRound } from 'lucide-react'
type Props = {
    initialState: boolean
}
const LoginButton = ({ initialState }: Props) => {
    const auth = useAuthStore()
    const [authState, setAuthState] = useState<boolean>(initialState)

    useEffect(() => {
        setAuthState(auth.token ? true : false)
    }, [auth])

    const handleLogout = () => {
        auth.setToken(null)
    }
    if (authState) {
        return (
            <>
                <Button asChild size="icon" className="sm:hidden">
                    <Link href="/pedidos" aria-label="Meus pedidos">
                        <ClipboardList />
                    </Link>
                </Button>
                <Button asChild className="hidden sm:inline-flex">
                    <Link href="/pedidos">Meus Pedidos</Link>
                </Button>
                <Button size="icon" onClick={handleLogout} className="sm:hidden" aria-label="Sair">
                    <LogOut />
                </Button>
                <Button onClick={handleLogout} className="hidden sm:inline-flex">Sair</Button>
            </>
        )
    }
    return (
        <Button onClick={() => auth.setOpen(true)} aria-label="Login ou cadastro" className="size-10 px-0 sm:h-9 sm:w-auto sm:px-4">
            <UserRound className="size-4" />
            <span className="hidden sm:inline">Login / Cadastro</span>
        </Button>
    )
}

export default LoginButton
