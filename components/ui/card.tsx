import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

// Enhanced Card with variants
interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "floating"
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "rounded-lg border bg-card text-card-foreground shadow-sm",
      elevated: "rounded-xl border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-200",
      floating:
        "rounded-xl border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1",
    }

    return <div ref={ref} className={cn(variantClasses[variant], className)} {...props} />
  },
)
EnhancedCard.displayName = "EnhancedCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, EnhancedCard }
