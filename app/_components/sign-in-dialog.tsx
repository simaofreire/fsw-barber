"use client"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "./ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"

const SignInDialog = () => {
  const [loading, setLoading] = useState(false)

  return (
    <>
      <DialogHeader>
        <DialogTitle>Faça login na plataforma</DialogTitle>
        <DialogDescription>
          Conecte-se usando sua conta do Google
        </DialogDescription>
      </DialogHeader>

      <Button
        variant="outline"
        className="gap-1 font-bold"
        onClick={() => {
          signIn("google")
          setLoading(true)
        }}
        disabled={loading}
      >
        <Image src="/google.svg" alt="google icon" width={18} height={18} />
        Google
      </Button>
    </>
  )
}

export default SignInDialog
