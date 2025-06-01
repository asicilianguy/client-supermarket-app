"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  color?: "primary" | "secondary" | "white" | "gray"
}

export function LoadingSpinner({ size = "md", className, color = "primary" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  const colorClasses = {
    primary: "border-primary-purple border-t-transparent",
    secondary: "border-primary-orange border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-400 border-t-transparent",
  }

  return <div className={cn("border-2 rounded-full animate-spin", sizeClasses[size], colorClasses[color], className)} />
}

interface LoadingStateProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingState({ message = "Caricamento...", size = "md", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <LoadingSpinner size={size === "sm" ? "md" : size === "md" ? "lg" : "xl"} />
      <p className="text-gray-600 mt-4 font-nunito">{message}</p>
    </div>
  )
}

export function FullPageLoading({ message = "Caricamento..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <LoadingSpinner size="xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-r from-primary-orange to-primary-pink rounded-full animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl font-fredoka font-bold text-gray-900 mb-2">{message}</h2>
        <p className="text-gray-600 font-nunito">Un momento, stiamo preparando tutto per te...</p>
      </div>
    </div>
  )
}

export function InlineLoading({ message, size = "sm" }: { message?: string; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} />
      {message && <span className="text-sm text-gray-600 font-nunito">{message}</span>}
    </div>
  )
}
