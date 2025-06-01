"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { StepIndicator } from "@/components/ui/step-indicator"
import { PasswordStrength } from "@/components/ui/password-strength"
import { SupermarketSelector } from "@/components/ui/supermarket-selector"
import { ArrowLeft, ArrowRight, User, Phone, Lock, Store, Sparkles, Gift } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useRegisterMutation } from "@/lib/api/authApi"
import { useAppDispatch } from "@/lib/hooks"
import { setCredentials } from "@/lib/slices/authSlice"
import React from "react"

const STEP_LABELS = ["Nome", "Telefono", "Password", "Supermercati"]

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [register, { isLoading, error }] = useRegisterMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    frequentedSupermarkets: [] as string[],
  })

  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    frequentedSupermarkets: "",
  })

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return "Il nome è obbligatorio"
    if (name.trim().length < 2) return "Il nome deve avere almeno 2 caratteri"
    return ""
  }

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10}$/
    if (!phone) return "Il numero di telefono è obbligatorio"
    if (!phoneRegex.test(phone)) return "Inserisci esattamente 10 cifre"
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) return "La password è obbligatoria"
    if (password.length < 6) return "La password deve avere almeno 6 caratteri"
    return ""
  }

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return "Conferma la password"
    if (confirmPassword !== password) return "Le password non coincidono"
    return ""
  }

  const validateSupermarkets = (supermarkets: string[]) => {
    if (supermarkets.length === 0) return "Seleziona almeno un supermercato"
    return ""
  }

  // Step validation
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return !validateName(formData.name)
      case 2:
        return !validatePhoneNumber(formData.phoneNumber)
      case 3:
        return (
          !validatePassword(formData.password) && !validateConfirmPassword(formData.confirmPassword, formData.password)
        )
      case 4:
        return !validateSupermarkets(formData.frequentedSupermarkets)
      default:
        return false
    }
  }

  const handleNext = () => {
    // Validate current step
    const stepErrors = { ...errors }

    switch (currentStep) {
      case 1:
        stepErrors.name = validateName(formData.name)
        break
      case 2:
        stepErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber)
        break
      case 3:
        stepErrors.password = validatePassword(formData.password)
        stepErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password)
        break
      case 4:
        stepErrors.frequentedSupermarkets = validateSupermarkets(formData.frequentedSupermarkets)
        break
    }

    setErrors(stepErrors)

    if (isStepValid(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    console.log("🚀 Starting registration process...")

    try {
      // Prova prima con +39, poi senza se fallisce
      const phoneWithPrefix = `+39${formData.phoneNumber}`

      const registrationData = {
        name: formData.name.trim(),
        phoneNumber: phoneWithPrefix,
        password: formData.password,
        frequentedSupermarkets: formData.frequentedSupermarkets,
      }

      console.log("📝 Registration data with +39:", {
        ...registrationData,
        password: "***hidden***",
      })

      let result
      try {
        result = await register(registrationData).unwrap()
      } catch (firstError: any) {
        console.log("⚠️ Registration with +39 failed, trying without prefix...")

        // Se fallisce con +39, prova senza
        const registrationDataWithoutPrefix = {
          ...registrationData,
          phoneNumber: formData.phoneNumber,
        }

        result = await register(registrationDataWithoutPrefix).unwrap()
      }

      console.log("✅ Registration successful:", result)

      dispatch(setCredentials({ token: result.token }))

      toast({
        variant: "default",
        title: "🎉 Registrazione completata!",
        description: "Benvenuto in SpesaViva! Ora puoi iniziare a risparmiare.",
      })

      // Redirect to shopping list after toast
      setTimeout(() => {
        router.push("/shopping-list")
      }, 2000)
    } catch (err: any) {
      console.error("❌ Registration failed:", err)

      let errorMessage = "Si è verificato un errore durante la registrazione"

      // Gestione errori più specifica
      if (err?.status === 404) {
        errorMessage = "Servizio temporaneamente non disponibile. Riprova più tardi."
      } else if (err?.status === 400) {
        errorMessage = "Dati non validi. Controlla i campi inseriti."
      } else if (err?.status === 409) {
        errorMessage = "Questo numero di telefono è già registrato."
      } else if (err?.status === 500) {
        errorMessage = "Errore del server. Riprova più tardi."
      } else if (err?.data?.message) {
        errorMessage = err.data.message
      } else if (err?.data?.error) {
        errorMessage = err.data.error
      } else if (err?.message) {
        errorMessage = err.message
      }

      toast({
        variant: "destructive",
        title: "Errore nella registrazione",
        description: errorMessage,
      })
    }
  }

  // Debug: mostra errori API
  React.useEffect(() => {
    if (error) {
      console.error("🔥 API Error:", error)
    }
  }, [error])

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-orange/20 to-primary-pink/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary-orange" />
              </div>
              <h2 className="font-fredoka text-2xl font-bold text-gray-900 mb-2">Come ti chiami?</h2>
              <p className="font-nunito text-gray-600">Iniziamo con il tuo nome</p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Il tuo nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`text-lg py-4 rounded-2xl border-2 transition-all duration-200 ${
                    errors.name ? "border-red-500" : "border-gray-200 focus:border-primary-purple"
                  }`}
                  autoFocus
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 font-nunito">{errors.name}</p>}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-blue/20 to-primary-purple/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary-blue" />
              </div>
              <h2 className="font-fredoka text-2xl font-bold text-gray-900 mb-2">Il tuo numero</h2>
              <p className="font-nunito text-gray-600">Useremo il tuo numero per accedere all'app</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-stretch">
                  <div className="bg-gradient-to-r from-primary-blue to-primary-purple text-white px-4 rounded-l-2xl border-2 border-r-0 border-primary-blue flex items-center justify-center min-h-[3.5rem]">
                    <span className="font-fredoka font-bold">+39</span>
                  </div>
                  <Input
                    placeholder="1234567890"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                      setFormData({ ...formData, phoneNumber: value })
                    }}
                    className={`rounded-l-none rounded-r-2xl text-lg border-2 border-l-0 min-h-[3.5rem] transition-all duration-200 ${
                      errors.phoneNumber ? "border-red-500" : "border-primary-blue focus:border-primary-purple"
                    }`}
                    type="tel"
                    maxLength={10}
                    autoFocus
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1 font-nunito">{errors.phoneNumber}</p>}
                <p className="text-sm text-gray-500 mt-2 font-nunito">Inserisci le 10 cifre del tuo numero italiano</p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-purple/20 to-primary-pink/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-purple" />
              </div>
              <h2 className="font-fredoka text-2xl font-bold text-gray-900 mb-2">Scegli una password</h2>
              <p className="font-nunito text-gray-600">Proteggi il tuo account con una password sicura</p>
            </div>

            <div className="space-y-6">
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`text-lg py-4 rounded-2xl border-2 transition-all duration-200 ${
                    errors.password ? "border-red-500" : "border-gray-200 focus:border-primary-purple"
                  }`}
                  autoFocus
                />
                {errors.password && <p className="text-red-500 text-sm mt-1 font-nunito">{errors.password}</p>}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Conferma password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`text-lg py-4 rounded-2xl border-2 transition-all duration-200 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-200 focus:border-primary-purple"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 font-nunito">{errors.confirmPassword}</p>
                )}
              </div>

              {formData.password && <PasswordStrength password={formData.password} />}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-green/20 to-primary-yellow/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-primary-green" />
              </div>
              <h2 className="font-fredoka text-2xl font-bold text-gray-900 mb-2">I tuoi supermercati</h2>
              <p className="font-nunito text-gray-600">Seleziona dove fai solitamente la spesa</p>
            </div>

            <SupermarketSelector
              selectedSupermarkets={formData.frequentedSupermarkets}
              onSelectionChange={(selected) => setFormData({ ...formData, frequentedSupermarkets: selected })}
            />

            {errors.frequentedSupermarkets && (
              <p className="text-red-500 text-sm text-center font-nunito">{errors.frequentedSupermarkets}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-4 py-4 border-b border-gray-100">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-2xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Indietro
            </Button>
          </Link>
          <Image src="/logo-spesaviva-horizontal.png" alt="SpesaViva" width={120} height={36} className="h-8 w-auto" />
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Free Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-green to-primary-blue text-white px-6 py-3 rounded-full shadow-lg animate-bounce-gentle">
            <Gift className="w-5 h-5" />
            <span className="font-fredoka font-bold">PROVARE È GRATUITO</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Step Indicator - Centered */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={4}
          stepLabels={STEP_LABELS}
          onStepClick={(step) => {
            // Permetti navigazione solo agli step precedenti o al prossimo se il corrente è valido
            if (step <= currentStep || (step === currentStep + 1 && isStepValid(currentStep))) {
              setCurrentStep(step)
            }
          }}
        />

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-3 bg-yellow-100 rounded-lg text-sm">
            <p>
              <strong>Debug Info:</strong>
            </p>
            <p>Step: {currentStep}</p>
            <p>Name: {formData.name}</p>
            <p>Phone: {formData.phoneNumber}</p>
            <p>Supermarkets: {formData.frequentedSupermarkets.length}</p>
            <p>Loading: {isLoading ? "Yes" : "No"}</p>
            <p>API Base URL: https://server-supermarket-app.onrender.com/api</p>
            <p>Register Endpoint: /auth/register</p>
            {error && <p className="text-red-600">Error: {JSON.stringify(error)}</p>}
          </div>
        )}

        {/* Form Card */}
        <Card className="animate-fade-in">
          <CardContent className="p-8">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex space-x-4 mt-8">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 py-4 rounded-2xl border-2 border-gray-300 hover:border-primary-purple"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Indietro
                </Button>
              )}

              <Button
                onClick={handleNext}
                disabled={!isStepValid(currentStep) || isLoading}
                className={`py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                  currentStep === 1 ? "w-full" : "flex-1"
                } ${
                  isStepValid(currentStep)
                    ? "bg-gradient-to-r from-primary-orange to-primary-pink text-white hover:from-primary-pink hover:to-primary-purple"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creazione account...</span>
                  </div>
                ) : currentStep === 4 ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Crea Account
                  </>
                ) : (
                  <>
                    Avanti
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-8">
          <Link href="/login" className="font-nunito text-gray-600 hover:text-primary-purple transition-colors">
            Hai già un account? <span className="font-semibold">Accedi</span>
          </Link>
        </div>

        {/* Free Features */}
        <div className="mt-12 text-center">
          <h3 className="font-fredoka text-lg font-bold text-gray-900 mb-4">Cosa ottieni provando SpesaViva</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3 bg-white/70 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-primary-green/20 rounded-full flex items-center justify-center">
                <span className="text-primary-green">✓</span>
              </div>
              <span className="font-nunito text-gray-700">Lista della spesa intelligente</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/70 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-primary-blue/20 rounded-full flex items-center justify-center">
                <span className="text-primary-blue">✓</span>
              </div>
              <span className="font-nunito text-gray-700">Confronto offerte in tempo reale</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/70 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-primary-purple/20 rounded-full flex items-center justify-center">
                <span className="text-primary-purple">✓</span>
              </div>
              <span className="font-nunito text-gray-700">Accesso completo a 19+ catene</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
