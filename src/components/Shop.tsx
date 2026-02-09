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
  price: number | string;
  image: string;
  images?: string[]; // Array of image URLs
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
          images: p.images || (p.image ? [p.image] : []), // Support images array or fall back to single image
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

  // Helper function to convert price to number
  const getPriceAsNumber = (price: number | string): number => {
    if (typeof price === 'string') {
      return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    }
    return price || 0;
  };

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

    // Return filtered products (no sorting)
    return filtered;
  })();

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const productId = getProductId(product);
      const existingItem = prevCart.find(item => getProductId(item.product) === productId);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map(item =>
          getProductId(item.product) === productId
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

  // Helper function to get product ID
  const getProductId = (product: Product): string | number => {
    return product.id || product._id || '';
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        getProductId(item.product) === productId
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
      const updatedCart = prevCart.filter(item => getProductId(item.product) !== productId);
      
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
    return cart.reduce((total, item) => total + (getPriceAsNumber(item.product.price) * item.quantity), 0);
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

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Error loading cart from localStorage:', e);
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Category Filter */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            {/* Search - Left End */}
            <div className="w-full md:w-auto md:flex-shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-gray-400"
              />
            </div>

            {/* Category Filter - Buttons like Portfolio */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap justify-start gap-2">
                {categories.map((category) => {
                  const isActive = selectedCategory.toLowerCase() === category.id.toLowerCase();
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold uppercase transition-colors ${
                        isActive
                          ? 'bg-[#009f3b] text-white'
                          : 'bg-gray-200 text-[#009f3b] hover:bg-gray-300'
                      }`}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'No products available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              // Get the first image from images array or fall back to image
              const productImage = (product.images && Array.isArray(product.images) && product.images.length > 0)
                ? product.images[0]
                : product.image;
              const productId = getProductId(product);

              return (
                <div
                  key={productId}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
                >
                  <Link href={`/shop/${product._id || product.id}`}>
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/shop/${product._id || product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-[#009f3b] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-[#009f3b]">
                        {formatPrice(getPriceAsNumber(product.price))}
                      </span>
                      {product.hasVariants && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Variants
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-[#009f3b] text-white px-4 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cart Sidebar */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-gray-600">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => {
                      const productImage = (item.product.images && Array.isArray(item.product.images) && item.product.images.length > 0)
                        ? item.product.images[0]
                        : item.product.image;
                      const itemProductId = getProductId(item.product);

                      return (
                        <div key={itemProductId} className="flex gap-4 border-b border-gray-200 pb-4">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={productImage}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">{item.product.name}</h4>
                            <p className="text-sm text-[#009f3b] font-semibold mb-2">
                              {formatPrice(getPriceAsNumber(item.product.price))}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(getProductId(item.product), item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(getProductId(item.product), item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                              <button
                                onClick={() => removeFromCart(getProductId(item.product))}
                                className="ml-auto text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-[#009f3b]">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="block w-full bg-[#009f3b] text-white px-6 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors text-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

