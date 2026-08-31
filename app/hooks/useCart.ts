'use client'
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const CART_KEY = 'apic_cart'

interface CartContextType {
  selectedItems: string[]
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  toggleItem: (name: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const isHydrated = useRef(false)

  // Hydrate once from localStorage after client-side mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) setSelectedItems(JSON.parse(stored))
    } catch (e) {
      console.error('[cart] read error:', e)
    } finally {
      isHydrated.current = true
    }
  }, [])

  // Persist on state change — skipped until initial hydration completes to prevent data wipeout
  useEffect(() => {
    if (!isHydrated.current) return
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(selectedItems))
    } catch (e) {
      console.error('[cart] write error:', e)
    }
  }, [selectedItems])

  // Passive synchronization observer for cross-tab or focus triggers
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const stored = localStorage.getItem(CART_KEY)
        setSelectedItems(stored ? JSON.parse(stored) : [])
      } catch {}
    }
    window.addEventListener('storage', syncFromStorage)
    window.addEventListener('focus', syncFromStorage)
    return () => {
      window.removeEventListener('storage', syncFromStorage)
      window.removeEventListener('focus', syncFromStorage)
    }
  }, [])

  const toggleItem = useCallback((name: string) => {
    setSelectedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    )
  }, [])

  return React.createElement(
    CartContext.Provider,
    { value: { selectedItems, setSelectedItems, toggleItem } },
    children
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
