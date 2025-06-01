import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface LoginRequest {
  phoneNumber: string
  password: string
}

export interface RegisterRequest {
  name: string
  phoneNumber: string
  password: string
  frequentedSupermarkets: string[]
}

export interface AuthResponse {
  token: string
  user?: {
    _id: string
    name: string
    phoneNumber: string
    frequentedSupermarkets: string[]
  }
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://server-supermarket-app.onrender.com/api/users",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => {
        console.log("🔐 Login request:", credentials)
        return {
          url: "/login",
          method: "POST",
          body: credentials,
        }
      },
      transformResponse: (response: any) => {
        console.log("✅ Login response:", response)
        return response
      },
      transformErrorResponse: (response: any) => {
        console.error("❌ Login error:", response)
        return response
      },
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "success",
              title: "🎉 Bentornato!",
              description: "Accesso effettuato con successo",
            })
          }
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            let errorMessage = "Credenziali non valide"
            if (error?.error?.data?.message) {
              errorMessage = error.error.data.message
            } else if (error?.error?.data?.errors && Array.isArray(error.error.data.errors)) {
              errorMessage = error.error.data.errors.map((e: any) => e.msg).join(", ")
            }
            toast({
              variant: "destructive",
              title: "❌ Errore di accesso",
              description: errorMessage,
            })
          }
        }
      },
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => {
        console.log("📝 Register request:", userData)
        return {
          url: "/register",
          method: "POST",
          body: userData,
        }
      },
      transformResponse: (response: any) => {
        console.log("✅ Register response:", response)
        return response
      },
      transformErrorResponse: (response: any) => {
        console.error("❌ Register error:", response)
        return response
      },
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "success",
              title: "🎉 Registrazione completata!",
              description: "Benvenuto in SpesaViva! Ora puoi iniziare a risparmiare.",
            })
          }
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            let errorMessage = "Si è verificato un errore durante la registrazione"
            if (error?.error?.data?.message) {
              errorMessage = error.error.data.message
            } else if (error?.error?.data?.errors && Array.isArray(error.error.data.errors)) {
              errorMessage = error.error.data.errors.map((e: any) => e.msg).join(", ")
            }
            toast({
              variant: "destructive",
              title: "❌ Errore nella registrazione",
              description: errorMessage,
            })
          }
        }
      },
    }),

    verifyPhoneNumber: builder.mutation<{ msg: string }, { phoneNumber: string; verificationCode: string }>({
      query: (data) => ({
        url: "/verify-phone",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "success",
              title: "✅ Numero verificato!",
              description: "Il tuo numero di telefono è stato verificato con successo",
            })
          }
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nella verifica",
              description: error?.error?.data?.message || "Codice di verifica non valido",
            })
          }
        }
      },
    }),

    resendVerificationCode: builder.mutation<{ msg: string }, { phoneNumber: string }>({
      query: (data) => ({
        url: "/resend-code",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "success",
              title: "📱 Codice inviato!",
              description: "Un nuovo codice di verifica è stato inviato al tuo numero",
            })
          }
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nell'invio",
              description: error?.error?.data?.message || "Impossibile inviare il codice",
            })
          }
        }
      },
    }),

    requestPasswordReset: builder.mutation<{ msg: string }, { phoneNumber: string }>({
      query: (data) => ({
        url: "/request-reset",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "success",
              title: "📱 Codice di reset inviato!",
              description: "Controlla il tuo telefono per il codice di reset password",
            })
          }
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nella richiesta",
              description: error?.error?.data?.message || "Impossibile inviare il codice di reset",
            })
          }
        }
      },
    }),

    resetPassword: builder.mutation<{ msg: string }, { phoneNumber: string; resetCode: string; newPassword: string }>({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "success",
              title: "🔒 Password aggiornata!",
              description: "La tua password è stata modificata con successo",
            })
          }
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nel reset",
              description: error?.error?.data?.message || "Impossibile aggiornare la password",
            })
          }
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyPhoneNumberMutation,
  useResendVerificationCodeMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi
