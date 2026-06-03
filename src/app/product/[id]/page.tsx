'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart, Product } from '@/context/CartContext';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) console.error('Error fetching product:', error);
      else if (data) setProduct(data);
      setLoading(false);
    };

    fetchSingleProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <p className="animate-pulse text-neutral-400">Loading details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white space-y-4">
        <h2 className="text-xl font-bold">Product not found.</h2>
        <button onClick={() => router.push('/')} className="text-neutral-400 underline hover:text-white transition">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-28 selection:bg-neutral-700">
      
      <nav className="fixed top-0 w-full z-40 px-5 py-4 flex justify-between items-center bg-gradient-to-b from-neutral-950/80 to-transparent pointer-events-none">
        <button 
          onClick={() => router.back()} 
          className="pointer-events-auto w-10 h-10 bg-neutral-900/80 backdrop-blur-md rounded-full flex items-center justify-center border border-neutral-800 text-white active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="pointer-events-auto w-10 h-10 bg-neutral-900/80 backdrop-blur-md rounded-full flex items-center justify-center border border-neutral-800 text-white active:scale-95 transition">
          <Share className="w-5 h-5" />
        </button>
      </nav>

      <div className="w-full aspect-[3/4] bg-neutral-900 relative">
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <main className="px-5 py-8 space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-sm text-neutral-500 font-medium uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold tracking-tighter leading-tight text-white">{product.name}</h1>
          </div>
          <span className="text-2xl font-bold">${product.price}</span>
        </div>

        <hr className="border-neutral-800" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">The Details</h3>
          <p className="text-neutral-400 leading-relaxed text-base">
            {product.description || 'No description available for this product.'}
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 w-full z-40 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-900 pb-safe px-5 py-4 flex gap-4">
        <button className="w-14 h-14 shrink-0 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400 active:bg-neutral-800 transition">
          <Heart className="w-6 h-6" />
        </button>
        <button 
          className="flex-1 bg-white text-black font-bold text-lg rounded-2xl active:scale-[0.98] transition-transform"
          onClick={() => addToCart(product)}
        >
          Add to Cart - ${product.price}
        </button>
      </div>

    </div>
  );
}