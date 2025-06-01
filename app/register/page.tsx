"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Phone, Lock, User, ArrowLeft } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { SupermarketSelector } from "@/components/ui/supermarket-selector"
import { PasswordStrength } from "@/components/ui/password-strength"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRegisterMutation } from "@/lib/api/authApi"
import { useAppDispatch } from "@/lib/hooks"
import { setCredentials } from "@/lib/slices/authSlice"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    frequentedSupermarkets: [] as string[],
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [register, { isLoading }] = useRegisterMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phoneNumber || !formData.password) {
      toast({
        variant: "destructive",
        title: "Campi obbligatori",
        description: "Compila tutti i campi richiesti",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password non corrispondenti",
        description: "Le password inserite non coincidono",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password troppo corta",
        description: "La password deve essere di almeno 6 caratteri",
      })
      return
    }

    if (formData.frequentedSupermarkets.length === 0) {
      toast({
        variant: "destructive",
        title: "Seleziona almeno un supermercato",
        description: "Scegli i supermercati che frequenti di più",
      })
      return
    }

    try {
      const result = await register({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        frequentedSupermarkets: formData.frequentedSupermarkets,
      }).unwrap()

      dispatch(setCredentials({ token: result.token }))

      toast({
        variant: "success",
        title: "Registrazione completata!",
        description: "Benvenuto in SpesaViva",
      })

      router.push("/dashboard")
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Errore di registrazione",
        description: err?.data?.message || "Si è verificato un errore durante la registrazione",
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

          <h1 className="text-2xl font-fredoka font-bold text-gray-900 mb-2">Unisciti a SpesaViva</h1>
          <p className="text-gray-600">Crea il tuo account e inizia a risparmiare</p>
        </div>

        {/* Registration Form */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-fredoka">Registrati</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Il tuo nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-primary-purple rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Numero di telefono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="tel"
                    placeholder="3XX XXX XXXX"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: formatPhoneNumber(e.target.value) })}
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
                    placeholder="Crea una password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                {formData.password && <PasswordStrength password={formData.password} />}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Conferma password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Conferma la password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-primary-purple rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Supermarket Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Supermercati frequentati</label>
                <SupermarketSelector
                  selectedSupermarkets={formData.frequentedSupermarkets}
                  onSelectionChange={(supermarkets) =>
                    setFormData({ ...formData, frequentedSupermarkets: supermarkets })
                  }
                />
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
                    <span>Registrazione in corso...</span>
                  </div>
                ) : (
                  "Crea Account"
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="text-center">
              <div className="text-sm text-gray-600">
                Hai già un account?{" "}
                <Link href="/login" className="text-primary-purple hover:text-primary-purple/80 font-medium">
                  Accedi
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
