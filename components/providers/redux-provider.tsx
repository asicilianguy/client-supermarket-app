"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { initializeAuth } from "@/lib/slices/authSlice"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      store.dispatch(initializeAuth())
      initialized.current = true
    }
  }, [])

  return <Provider store={store}>{children}</Provider>
}
