"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, Sparkles, TrendingDown, Clock } from "lucide-react"

const floatingIcons = [
  { Icon: ShoppingCart, delay: 0 },
  { Icon: Sparkles, delay: 0.5 },
  { Icon: TrendingDown, delay: 1 },
  { Icon: Clock, delay: 1.5 },
]

export function FloatingElements() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floatingIcons.map(({ Icon, delay }, index) => (
        <div
          key={index}
          className={`absolute transition-all duration-1000 ${
            isVisible ? "opacity-30 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            left: `${20 + index * 20}%`,
            top: `${30 + (index % 2) * 40}%`,
            animationDelay: `${delay}s`,
          }}
        >
          <div className="animate-bounce">
            <Icon className="w-6 h-6 text-apple-blossom/30" />
          </div>
        </div>
      ))}
    </div>
  )
}
