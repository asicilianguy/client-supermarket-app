import type React from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "light" | "dark"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const Logo: React.FC<LogoProps> = ({ variant = "light", size = "md", className }) => {
  const sizeClasses = {
    sm: "h-6 text-lg",
    md: "h-8 text-xl",
    lg: "h-10 text-2xl",
    xl: "h-12 text-3xl",
  }

  const colorClasses = {
    light: "text-neutral-900",
    dark: "text-white",
  }

  return (
    <div className={cn("flex items-center space-x-2", sizeClasses[size], className)}>
      {/* Logo Icon */}
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary",
          sizeClasses[size],
          size === "sm" && "w-6",
          size === "md" && "w-8",
          size === "lg" && "w-10",
          size === "xl" && "w-12",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn(
            "text-white",
            size === "sm" && "w-3 h-3",
            size === "md" && "w-4 h-4",
            size === "lg" && "w-5 h-5",
            size === "xl" && "w-6 h-6",
          )}
        >
          <path
            d="M3 3h18l-2 13H5L3 3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path
            d="M16 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M8 12l3-3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Logo Text */}
      <span className={cn("font-bold tracking-tight", colorClasses[variant])}>SpesaViva</span>
    </div>
  )
}

export { Logo }
