'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Types ---
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
}

// --- Create the Context ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Provider Component ---
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Derived totals
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Auto-open cart for immediate feedback
    setIsCartOpen(true);

    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{
      cart, cartTotal, cartItemCount, isCartOpen, setIsCartOpen, addToCart, updateQuantity, removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

// --- Custom Hook for easy access ---
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}