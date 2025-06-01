import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

const baseQuery = fetchBaseQuery({
  baseUrl: "https://server-supermarket-app.onrender.com/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set("x-auth-token", token)
    }
    headers.set("Content-Type", "application/json")
    return headers
  },
})

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "ShoppingList", "Offer", "Profile"],
  endpoints: () => ({}),
})
