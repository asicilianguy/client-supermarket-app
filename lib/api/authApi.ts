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
    baseUrl: "https://server-supermarket-app.onrender.com/api/users", // Cambiato da /api/auth a /api/users
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
          url: "/login", // Ora punta a /api/users/login
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
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => {
        console.log("📝 Register request:", userData)
        return {
          url: "/register", // Ora punta a /api/users/register
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
    }),
    verifyPhoneNumber: builder.mutation<{ msg: string }, { phoneNumber: string; verificationCode: string }>({
      query: (data) => ({
        url: "/verify-phone",
        method: "POST",
        body: data,
      }),
    }),
    resendVerificationCode: builder.mutation<{ msg: string }, { phoneNumber: string }>({
      query: (data) => ({
        url: "/resend-code",
        method: "POST",
        body: data,
      }),
    }),
    requestPasswordReset: builder.mutation<{ msg: string }, { phoneNumber: string }>({
      query: (data) => ({
        url: "/request-reset",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<{ msg: string }, { phoneNumber: string; resetCode: string; newPassword: string }>({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
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
