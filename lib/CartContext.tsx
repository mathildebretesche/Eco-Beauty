import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  expirationDate: string;
  image?: string;
}

interface CartContextType {
  cart: CartProduct[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string, index?: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>([]);

  const addToCart = useCallback((product: CartProduct) => {
    setCart((prev) => [...prev, product]);
  }, []);

  const removeFromCart = useCallback((productId: string, index?: number) => {
    setCart((prev) => {
      const idx = index !== undefined ? index : prev.findIndex((p) => p.id === productId);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
