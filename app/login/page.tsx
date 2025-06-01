"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Phone, Lock, ArrowLeft } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import Link from "next/link"
import { useLoginMutation } from "@/lib/api/authApi"
import { useAppDispatch } from "@/lib/hooks"
import { setCredentials } from "@/lib/slices/authSlice"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading, error }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber || !password) {
      toast({
        variant: "destructive",
        title: "Campi obbligatori",
        description: "Inserisci numero di telefono e password",
      })
      return
    }

    try {
      const result = await login({ phoneNumber, password }).unwrap()
      dispatch(setCredentials({ token: result.token }))

      toast({
        variant: "success",
        title: "Accesso effettuato!",
        description: "Benvenuto in SpesaViva",
      })

      router.push("/dashboard")
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Errore di accesso",
        description: err?.data?.message || "Credenziali non valide",
      })
    }
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.startsWith("39")) {
      return numbers.slice(0, 12)
    }
    return numbers.slice(0, 10)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-purple/10 via-white to-primary-pink/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla home
          </Link>

          <Logo className="mx-auto mb-6" />

          <h1 className="text-2xl font-fredoka font-bold text-gray-900 mb-2">Bentornato!</h1>
          <p className="text-gray-600">Accedi al tuo account SpesaViva</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-fredoka">Accedi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Numero di telefono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="tel"
                    placeholder="3XX XXX XXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-primary-purple rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="La tua password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-primary-purple rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-primary-purple to-primary-pink text-white rounded-xl font-medium text-base"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Accesso in corso...</span>
                  </div>
                ) : (
                  "Accedi"
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="text-center space-y-4">
              <Link href="/forgot-password" className="text-sm text-primary-purple hover:text-primary-purple/80">
                Password dimenticata?
              </Link>

              <div className="text-sm text-gray-600">
                Non hai un account?{" "}
                <Link href="/register" className="text-primary-purple hover:text-primary-purple/80 font-medium">
                  Registrati
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
