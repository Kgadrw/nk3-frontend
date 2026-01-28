'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, X } from 'lucide-react';
import Footer from '@/components/Footer';
import ConfirmationModal from '@/components/ConfirmationModal';
import { ListSkeleton } from '@/components/skeletons';

type Product = {
  id: number | string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  variants?: Array<{ type: string; price: string; stock?: number; image?: string }>;
  hasVariants?: boolean;
};

type CartItem = {
  product: Product;
  quantity: number;
  selectedVariant?: { type: string; price: string; image?: string } | null;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            setCart(parsedCart);
          } catch (error) {
            console.error('Error parsing cart:', error);
          }
        }
        setLoading(false);
      }
    };
    
    loadCart();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateQuantity = (productId: string | number, quantity: number, variantType?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantType);
      return;
    }
    const updatedCart = cart.map(item => {
      const itemId = item.product.id || item.product._id;
      const matchesProduct = itemId === productId;
      const matchesVariant = variantType !== undefined
        ? (item.selectedVariant?.type === variantType)
        : !item.selectedVariant;
      
      if (matchesProduct && matchesVariant) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const removeFromCart = (productId: string | number, variantType?: string) => {
    const updatedCart = cart.filter(item => {
      const itemId = item.product.id || item.product._id;
      const matchesProduct = itemId === productId;
      const matchesVariant = variantType !== undefined
        ? (item.selectedVariant?.type === variantType)
        : !item.selectedVariant;
      return !(matchesProduct && matchesVariant);
    });
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const saveCart = (cartItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem('cartCount', totalItems.toString());
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'code',
    }).format(price).replace('RWF', 'FRW');
  };

  const clearCart = () => {
    setShowClearConfirm(true);
  };

  const handleClearConfirm = () => {
    setCart([]);
    saveCart([]);
    setShowClearConfirm(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
          </div>
          <ListSkeleton count={3} showImage={true} />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/shop" className="inline-flex items-center gap-2 text-[#009f3b] hover:text-[#00782d] transition-colors font-medium">
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-[#009f3b]" />
              Shopping Cart
            </h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link
                href="/shop"
                className="inline-block bg-[#009f3b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#00782d] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Cart Header */}
              <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Cart Items ({getTotalItems()})
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product._id || item.product.id}
                    className="bg-white rounded-lg shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <Link href={`/shop/${item.product._id || item.product.id}`} className="flex-shrink-0">
                        <div className="relative w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            unoptimized
                            loading="lazy"
                            sizes="128px"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link href={`/shop/${item.product._id || item.product.id}`}>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-[#009f3b] transition-colors">
                                {item.product.name}
                                {item.selectedVariant && (
                                  <span className="text-sm font-normal text-gray-600 ml-2">
                                    ({item.selectedVariant.type})
                                  </span>
                                )}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                            <p className="text-xl font-bold text-[#009f3b] mb-4">
                              {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              const itemId: string | number | undefined = item.product.id || item.product._id;
                              if (itemId !== undefined) {
                                removeFromCart(itemId, item.selectedVariant?.type);
                              }
                            }}
                            className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors p-2"
                            title="Remove item"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                              <button
                                onClick={() => {
                                  const itemId: string | number | undefined = item.product.id || item.product._id;
                                  if (itemId !== undefined) {
                                    updateQuantity(itemId, item.quantity - 1, item.selectedVariant?.type);
                                  }
                                }}
                                className="p-2 hover:bg-gray-100 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="px-4 py-2 text-sm font-semibold min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => {
                                  const itemId: string | number | undefined = item.product.id || item.product._id;
                                  if (itemId !== undefined) {
                                    updateQuantity(itemId, item.quantity + 1, item.selectedVariant?.type);
                                  }
                                }}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-[#009f3b]">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="block w-full bg-[#009f3b] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#00782d] transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/shop"
                    className="block w-full border border-gray-300 text-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-[#009f3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ConfirmationModal
        isOpen={showClearConfirm}
        title="Clear Cart"
        message="Are you sure you want to clear your cart? This action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Cancel"
        onConfirm={handleClearConfirm}
        onCancel={() => setShowClearConfirm(false)}
        type="warning"
      />
    </main>
  );
}

