"use client"

import { useState, useEffect } from "react"
import { Check, Sparkles, Plus } from "lucide-react"

const initialItems = [
  { id: 1, name: "Latte fresco", checked: false, offers: 3 },
  { id: 2, name: "Pane integrale", checked: false, offers: 5 },
  { id: 3, name: "Pomodori", checked: false, offers: 2 },
  { id: 4, name: "Pasta", checked: false, offers: 4 },
  { id: 5, name: "Banane bio", checked: false, offers: 2 },
]

const newProducts = ["Yogurt greco", "Olio extravergine", "Riso basmati", "Biscotti integrali"]

export function SmartShoppingList() {
  const [items, setItems] = useState(initialItems)
  const [showOffers, setShowOffers] = useState(false)
  const [newProduct, setNewProduct] = useState("")
  const [showNewProduct, setShowNewProduct] = useState(false)
  const [isIntelligent, setIsIntelligent] = useState(false)
  const [currentProductIndex, setCurrentProductIndex] = useState(0)

  useEffect(() => {
    const sequence = async () => {
      // Wait 2 seconds, then show offers gradually
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setShowOffers(true)

      // Wait 1.5 seconds, then add new product
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const product = newProducts[currentProductIndex]
      setNewProduct(product)
      setShowNewProduct(true)

      // Wait 1 second, then show intelligent message
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsIntelligent(true)

      // Wait 4 seconds, then reset and cycle
      await new Promise((resolve) => setTimeout(resolve, 4000))
      setShowOffers(false)
      setShowNewProduct(false)
      setIsIntelligent(false)
      setNewProduct("")
      setCurrentProductIndex((prev) => (prev + 1) % newProducts.length)
    }

    sequence()
    const interval = setInterval(sequence, 10000) // Repeat every 10 seconds

    return () => clearInterval(interval)
  }, [currentProductIndex])

  const toggleItem = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* Fixed height container to prevent layout shifts */}
      <div className="h-96 flex flex-col">
        {/* Paper Shopping List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative flex-1 flex flex-col">
          {/* Header */}
          <div className="relative border-b border-gray-100 mb-5 pb-3 flex-shrink-0">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-orange to-primary-pink rounded-full"></div>
            <h3 className="font-fredoka text-lg font-bold text-gray-800 pl-4">Lista della Spesa</h3>
          </div>

          {/* Shopping Items - flex-1 to take remaining space */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                        className="sr-only"
                      />
                      <span
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-300 ${
                          item.checked
                            ? "bg-primary-green border-primary-green"
                            : "border-gray-300 hover:border-primary-purple"
                        }`}
                      >
                        {item.checked && <Check className="w-3 h-3 text-white" />}
                      </span>
                    </label>
                    <span
                      className={`font-nunito text-sm transition-all duration-300 ${
                        item.checked ? "text-gray-400 line-through" : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Offers indicator */}
                  <div
                    className={`flex items-center space-x-1 transition-all duration-700 ${
                      showOffers ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <Sparkles className="w-4 h-4 text-primary-purple" />
                    <span className="text-sm font-nunito font-bold text-primary-purple">{item.offers}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* New Product - positioned at bottom */}
            <div className="flex-shrink-0 mt-4">
              {showNewProduct && (
                <div className="flex items-center space-x-3 animate-slide-up border-t border-gray-100 pt-4">
                  <Plus className="w-5 h-5 text-primary-orange" />
                  <span className="font-nunito text-sm text-primary-orange font-medium">{newProduct}</span>
                </div>
              )}
            </div>
          </div>

          {/* Intelligent Badge */}
          {showOffers && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-purple to-primary-pink text-white px-3 py-1 rounded-full text-xs font-fredoka font-bold shadow-lg border-2 border-white transition-all duration-500">
              ✨ SMART
            </div>
          )}
        </div>

        {/* Intelligent Message - fixed position at bottom */}
        <div className="h-12 flex items-center justify-center mt-4">
          {isIntelligent && (
            <div className="animate-fade-in">
              <p className="text-sm font-nunito text-primary-purple font-bold flex items-center justify-center space-x-1">
                <Sparkles className="w-4 h-4" />
                <span>La tua lista è diventata intelligente!</span>
                <Sparkles className="w-4 h-4" />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
