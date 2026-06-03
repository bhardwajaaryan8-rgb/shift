'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Home as HomeIcon, User, Plus, Minus, X, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart, Product } from '@/context/CartContext';

const CATEGORIES = ['All', 'Apparel', 'Accessories', 'Essentials'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Pulling global cart state
  const { cart, cartTotal, cartItemCount, isCartOpen, setIsCartOpen, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching from Supabase:', error);
      else if (data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-24 selection:bg-neutral-700">
      
      <header className="sticky top-0 w-full z-30 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900 px-5 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tighter uppercase">Shift</h1>
        <Search className="w-5 h-5 text-neutral-400" />
      </header>

      <section className="px-5 py-8 space-y-4">
        <h2 className="text-4xl font-bold tracking-tighter leading-tight">
          Elevate Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-100">Daily Carry.</span>
        </h2>
        <div className="w-full aspect-[4/3] bg-neutral-900 rounded-2xl overflow-hidden relative border border-neutral-800">
          <img src="https://placehold.co/800x600/171717/ededed?text=New+Collection" alt="Hero" className="w-full h-full object-cover opacity-80" />
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-white/20 transition">
              Shop Collection <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <main className="px-5">
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-white text-black' 
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="aspect-[4/5] bg-neutral-900 rounded-2xl border border-neutral-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex flex-col gap-3">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 active:scale-[0.98] transition-transform">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </Link>
                <div className="flex justify-between items-start px-1">
                  <div>
                    <h4 className="font-semibold text-base text-neutral-100">{product.name}</h4>
                    <p className="text-sm text-neutral-500">{product.category}</p>
                  </div>
                  <span className="font-medium text-white">${product.price}</span>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-3.5 bg-neutral-900 border border-neutral-800 text-white rounded-xl font-medium active:bg-neutral-800 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full z-40 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-900 pb-safe">
        <div className="flex justify-around items-center h-16 px-4">
          <button className="flex flex-col items-center gap-1 text-white">
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-neutral-500 relative"
            onClick={() => setIsCartOpen(true)}
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-500">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
      )}

      <div className={`fixed bottom-0 left-0 w-full bg-neutral-900 z-50 rounded-t-3xl transform transition-transform duration-300 ease-out flex flex-col max-h-[85vh] ${isCartOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsCartOpen(false)}>
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full"></div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <h2 className="text-xl font-bold tracking-tight">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 bg-neutral-800 rounded-full">
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-neutral-500 space-y-4">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-24 bg-neutral-800 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-white">{item.name}</h4>
                    <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-3 bg-neutral-800 rounded-full px-3 py-1.5 border border-neutral-700">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 active:scale-90 transition-transform"><Minus className="w-4 h-4 text-neutral-400" /></button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 active:scale-90 transition-transform"><Plus className="w-4 h-4 text-white" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-800 bg-neutral-900 pb-safe">
            <div className="flex justify-between items-center mb-4">
              <span className="text-neutral-400 font-medium">Subtotal</span>
              <span className="text-2xl font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            <button className="w-full py-4 bg-white text-black font-bold rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
              Checkout Safely
            </button>
          </div>
        )}
      </div>
    </div>
  );
}