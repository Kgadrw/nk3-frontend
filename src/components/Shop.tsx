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

    // Sort products
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => getPriceAsNumber(a.price) - getPriceAsNumber(b.price));
        break;
      case 'price-high':
        sorted.sort((a, b) => getPriceAsNumber(b.price) - getPriceAsNumber(a.price));
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

  // Shop is temporarily unavailable - show coming soon message
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-[#009f3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop Coming Soon
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            We're working hard to bring you an amazing shopping experience. 
            Our online shop will be available soon!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contact"
              className="bg-[#009f3b] text-white px-8 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors inline-block"
            >
              Contact Us
            </a>
            <a
              href="/"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-none font-semibold hover:bg-gray-300 transition-colors inline-block"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

