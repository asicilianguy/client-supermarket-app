"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const supermarkets = [
  { name: "Esselunga", logo: "/supermarkets/esselunga.png" },
  { name: "Lidl", logo: "/supermarkets/lidl.png" },
  { name: "Bennet", logo: "/supermarkets/bennet.png" },
  { name: "CRAI", logo: "/supermarkets/crai.jpeg" },
  { name: "Il Centesimo", logo: "/supermarkets/centesimo.png" },
  { name: "Todis", logo: "/supermarkets/todis.png" },
  { name: "Penny", logo: "/supermarkets/penny.png" },
  { name: "Carrefour Express", logo: "/supermarkets/carrefourexpress.png" },
  { name: "Carrefour Market", logo: "/supermarkets/carrefourmarket.png" },
  { name: "Carrefour Iper", logo: "/supermarkets/carrefouriper.png" },
  { name: "Il Gigante", logo: "/supermarkets/gigante.png" },
  { name: "Eurospin", logo: "/supermarkets/eurospin.png" },
  { name: "iN's Mercato", logo: "/supermarkets/ins.png" },
  { name: "MD", logo: "/supermarkets/md.png" },
]

export function SupermarketSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Visible logos count based on container width
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 4
    return window.innerWidth < 640 ? 3 : 4
  }

  const [visibleCount, setVisibleCount] = useState(getVisibleCount())

  // Update visible count on resize
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % supermarkets.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isPaused])

  // Create a circular array for smooth infinite scrolling
  const getVisibleLogos = () => {
    const result = []
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % supermarkets.length
      result.push(supermarkets[index])
    }
    return result
  }

  return (
    <div className="relative overflow-hidden">
      <div className="flex items-center justify-center mb-6">
        <p className="font-nunito text-sm text-gray-600 text-center font-medium">
          Centralizziamo le offerte di oltre 15 catene nazionali
        </p>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-blue/10 via-primary-purple/10 to-primary-pink/10 p-6 border border-gray-200"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        ref={containerRef}
      >
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-primary-blue/10 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-primary-pink/10 to-transparent z-10 pointer-events-none"></div>

        {/* Current visible logos */}
        <div className="flex justify-between">
          {getVisibleLogos().map((supermarket, index) => (
            <div
              key={`${supermarket.name}-${index}`}
              className="flex-1 mx-2 transition-all duration-500"
              style={{ transform: `translateX(${isPaused ? 0 : "-100%"})`, opacity: 1 }}
            >
              <div className="relative w-full h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 p-2 border border-gray-100">
                <Image
                  src={supermarket.logo || "/placeholder.svg"}
                  alt={supermarket.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <p className="text-xs text-center mt-2 font-nunito text-gray-600 truncate">{supermarket.name}</p>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-4 space-x-1">
          {supermarkets.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index >= currentIndex && index < currentIndex + visibleCount ? "bg-primary-purple" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to logo ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="font-nunito text-sm leading-relaxed">
          <span className="font-bold text-blue-700">Esselunga</span> •{" "}
          <span className="font-bold text-blue-600">Lidl</span> •{" "}
          <span className="font-bold text-green-600">Conad</span> •{" "}
          <span className="font-bold text-blue-600">Carrefour</span> •{" "}
          <span className="font-bold text-blue-700">Eurospin</span> •{" "}
          <span className="font-bold text-green-700">CRAI</span> •{" "}
          <span className="font-bold text-green-600">Despar</span> • <span className="font-bold text-red-600">MD</span>{" "}
          • <span className="font-bold text-orange-600">Todis</span> •{" "}
          <span className="font-bold text-purple-600">Bennet</span> •{" "}
          <span className="text-gray-500">e molti altri...</span>
        </p>
      </div>
    </div>
  )
}
