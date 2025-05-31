"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"

const shoppingItems = [
  { id: 1, name: "Latte fresco", checked: false },
  { id: 2, name: "Pane integrale", checked: true },
  { id: 3, name: "Pomodori", checked: false },
  { id: 4, name: "Pasta", checked: true },
  { id: 5, name: "Yogurt", checked: false },
  { id: 6, name: "Banane", checked: false },
]

export function ShoppingListVisual() {
  const [items, setItems] = useState(shoppingItems)
  const [animatedItems, setAnimatedItems] = useState<number[]>([])

  useEffect(() => {
    // Animate items appearing one by one
    items.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedItems((prev) => [...prev, index])
      }, index * 150)
    })
  }, [])

  return (
    <div className="relative">
      {/* Paper background with subtle shadow */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
        {/* Paper header */}
        <div className="border-b border-gray-200 pb-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Lista della Spesa</h3>
          <div className="w-12 h-0.5 bg-blue-500 mt-1"></div>
        </div>

        {/* Shopping items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center space-x-3 transition-all duration-500 ${
                animatedItems.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.checked ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {item.checked && <Check className="w-3 h-3 text-white" />}
              </div>
              <span
                className={`text-sm transition-colors ${item.checked ? "text-gray-500 line-through" : "text-gray-800"}`}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Paper lines effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute left-6 right-6 h-px bg-blue-100 opacity-30"
              style={{ top: `${120 + i * 24}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
