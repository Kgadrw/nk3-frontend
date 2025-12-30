'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Product = {
  id: number | string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const Shop = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/shop');
        const data = await res.json();
        const productsData = (data || []).map((p: any) => ({
          ...p,
          id: p._id || p.id,
          price: typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0 : p.price
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', label: 'All Products' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => (item.product.id || item.product._id) === (product.id || product._id));
      if (existingItem) {
        return prevCart.map(item =>
          (item.product.id || item.product._id) === (product.id || product._id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        (item.product.id || item.product._id) === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string | number) => {
    setCart(prevCart => prevCart.filter(item => (item.product.id || item.product._id) !== productId));
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
    }).format(price);
  };

  // Update cart count in localStorage to sync with navbar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem('cartCount', totalItems.toString());
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [cart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <Image
              src="/loader.gif"
              alt="Loading..."
              width={100}
              height={100}
              className="mx-auto"
              unoptimized
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-[#009f3b] text-white py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Our Shop</h1>
          <p className="text-sm md:text-base text-gray-200">Discover our services and products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="w-full">
          {/* Main Content */}
          <div className="w-full">
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Product Image - Clickable */}
                  <Link href={`/shop/${product._id || product.id}`}>
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 cursor-pointer">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 md:p-5">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-[#90EE90] uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                    <Link href={`/shop/${product._id || product.id}`}>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#009f3b] transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs md:text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                      {product.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xl md:text-2xl font-bold text-[#009f3b]">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="w-full sm:w-auto bg-[#009f3b] text-white px-4 md:px-5 py-2 md:py-2.5 font-semibold hover:bg-[#00782d] transition-colors flex items-center justify-center gap-2 group/btn text-sm md:text-base"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 text-lg">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Cart Button */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="w-full bg-[#009f3b] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            View Cart ({getTotalItems()}) - {formatPrice(getTotalPrice())}
          </button>
        </div>
      )}

      {/* Mobile Cart Overlay */}
      {cartOpen && cart.length > 0 && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setCartOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#009f3b]">Cart ({getTotalItems()})</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product._id || item.product.id} className="flex gap-4 mb-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.product.name}</h4>
                    <p className="text-[#009f3b] font-bold mb-2">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-[#009f3b]">{formatPrice(getTotalPrice())}</span>
              </div>
              <button className="w-full bg-[#009f3b] text-white py-3 rounded-lg font-semibold">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;

