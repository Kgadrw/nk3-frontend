'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CardSkeleton } from '@/components/skeletons';

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
};

const Shop = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const data = await cachedFetch<any[]>('/api/shop');
        const productsData = (data || []).map((p: any) => ({
          ...p,
          id: p._id || p.id,
          price: typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0 : p.price,
          variants: p.variants || [],
          hasVariants: p.hasVariants || (p.variants && p.variants.length > 0)
        }));
        setProducts(productsData);

        // Extract unique categories from products
        const uniqueCategories = new Set<string>();
        productsData.forEach((product: Product) => {
          if (product.category && product.category.trim()) {
            uniqueCategories.add(product.category.trim());
          }
        });

        // Sort categories and create category list
        const sortedCategories = Array.from(uniqueCategories).sort();
        const categoryList = [
          { id: 'all', label: 'All Products' },
          ...sortedCategories.map(cat => ({
            id: cat,
            label: cat
          }))
        ];
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = (() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }

    // Sort products
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order
        break;
    }

    return sorted;
  })();

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => (item.product.id || item.product._id) === (product.id || product._id));
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map(item =>
          (item.product.id || item.product._id) === (product.id || product._id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { product, quantity: 1 }];
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        const totalItems = updatedCart.reduce((total, item) => total + item.quantity, 0);
        localStorage.setItem('cartCount', totalItems.toString());
        window.dispatchEvent(new Event('cartUpdated'));
      }
      
      return updatedCart;
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        (item.product.id || item.product._id) === productId
          ? { ...item, quantity }
          : item
      );
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        const totalItems = updatedCart.reduce((total, item) => total + item.quantity, 0);
        localStorage.setItem('cartCount', totalItems.toString());
        window.dispatchEvent(new Event('cartUpdated'));
      }
      
      return updatedCart;
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => (item.product.id || item.product._id) !== productId);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        const totalItems = updatedCart.reduce((total, item) => total + item.quantity, 0);
        localStorage.setItem('cartCount', totalItems.toString());
        window.dispatchEvent(new Event('cartUpdated'));
      }
      
      return updatedCart;
    });
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
        {/* Filters and Sorting - All on same line */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search Bar */}
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent text-black placeholder:text-gray-500"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-48 relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent text-black bg-white appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left 0.75rem center',
                paddingLeft: '2.5rem'
              }}
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat.id !== 'all').map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="w-full sm:w-64 relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent text-black bg-white appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left 0.75rem center',
                paddingLeft: '2.5rem'
              }}
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Sort by: Price (Low to High)</option>
              <option value="price-high">Sort by: Price (High to Low)</option>
              <option value="name-asc">Sort by: Name (A-Z)</option>
              <option value="name-desc">Sort by: Name (Z-A)</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {filteredProducts.length} of {products.length}
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Products Grid - Alibaba Style */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id || product.id}
                  href={`/shop/${product._id || product.id}`}
                  className="bg-white border border-gray-200 hover:border-[#009f3b] transition-all duration-200 overflow-hidden group cursor-pointer flex flex-col"
                >
                  {/* Product Image Container */}
                  <div className="relative w-full aspect-square overflow-hidden bg-white">
                    {/* Category Sticker - Top Left */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-[#009f3b] text-white text-xs font-bold px-2 py-1 rounded shadow-md uppercase">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                  </div>

                  {/* Product Info - Alibaba Style */}
                  <div className="p-3 flex-1 flex flex-col bg-white">
                    {/* Product Name - 2 lines max */}
                    <h3 className="text-xs sm:text-sm text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-[#009f3b] transition-colors leading-tight">
                      {product.name}
                    </h3>
                    
                    {/* Description - Show a bit */}
                    {product.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                    
                    {/* Price Section */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-1">
                        {product.hasVariants && product.variants && product.variants.length > 0 ? (
                          <div>
                            <span className="text-base sm:text-lg font-bold text-[#FF6600]">
                              {(() => {
                                const prices = product.variants.map((v: any) => 
                                  parseFloat(v.price.replace(/[^0-9.]/g, '')) || 0
                                );
                                const minPrice = Math.min(...prices);
                                const maxPrice = Math.max(...prices);
                                if (minPrice === maxPrice) {
                                  return formatPrice(minPrice);
                                }
                                return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
                              })()}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {product.variants.length} type{product.variants.length > 1 ? 's' : ''} available
                            </div>
                          </div>
                        ) : (
                          <span className="text-base sm:text-lg font-bold text-[#FF6600]">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-full bg-[#009f3b] text-white text-xs py-2 px-3 hover:bg-[#00782d] transition-colors font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
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

      {/* Mobile Cart Button */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <Link
            href="/cart"
            className="block w-full bg-[#009f3b] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            View Cart ({getTotalItems()}) - {formatPrice(getTotalPrice())}
          </Link>
        </div>
      )}

      {/* Mobile Cart Overlay */}
      {cartOpen && cart.length > 0 && (
        <div className="lg:hidden fixed inset-0 backdrop-blur-md bg-white/10 z-50" onClick={() => setCartOpen(false)}>
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
                      loading="lazy"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-700 text-sm mb-1">{item.product.name}</h4>
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

