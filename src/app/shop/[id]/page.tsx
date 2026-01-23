'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Footer from '@/components/Footer';
import { ToastContainer, Toast, ToastType } from '@/components/Toast';
import { DetailSkeleton } from '@/components/skeletons';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const showToast = (message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);
  };
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const data = await cachedFetch<any>(`/api/shop/${id}`);
        if (data) {
          setProduct({
            ...data,
            price: typeof data.price === 'string' ? parseFloat(data.price.replace(/[^0-9.]/g, '')) || 0 : data.price
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'code',
    }).format(price).replace('RWF', 'FRW');
  };

  const addToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => (item.product._id || item.product.id) === (product._id || product.id));
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        product: {
          _id: product._id,
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        },
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
    localStorage.setItem('cartCount', totalItems.toString());
    window.dispatchEvent(new Event('cartUpdated'));
    
    showToast('Product added to cart!', 'success');
  };

  if (loading) {
    return (
      <>
        <DetailSkeleton />
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-[#009f3b] text-white px-6 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/shop" className="inline-flex items-center gap-2 text-[#009f3b] hover:text-[#00782d] transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-[#90EE90] text-[#009f3b] px-3 py-1 text-sm font-semibold uppercase mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#009f3b] mb-4">
                {product.name}
              </h1>
              <div className="text-3xl md:text-4xl font-bold text-[#009f3b] mb-6">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                onClick={addToCart}
                className="w-full bg-[#009f3b] text-white px-6 py-4 rounded-none font-semibold hover:bg-[#00782d] transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </main>
  );
}

