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
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://server-supermarket-app.onrender.com/api/auth",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
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
