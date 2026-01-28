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
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  
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
          const productData = {
            ...data,
            price: typeof data.price === 'string' ? parseFloat(data.price.replace(/[^0-9.]/g, '')) || 0 : data.price,
            variants: data.variants || [],
            hasVariants: data.hasVariants || (data.variants && data.variants.length > 0)
          };
          setProduct(productData);
          // Set first variant as default if variants exist
          if (productData.hasVariants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
          }
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
    
    // If product has variants, require variant selection
    if (product.hasVariants && !selectedVariant) {
      showToast('Please select a product type/variant', 'warning');
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Determine the price to use
    const itemPrice = product.hasVariants && selectedVariant
      ? parseFloat(selectedVariant.price.replace(/[^0-9.]/g, '')) || 0
      : product.price;
    
    // Create unique key for cart item (product ID + variant type if applicable)
    const itemKey = product.hasVariants && selectedVariant
      ? `${product._id || product.id}_${selectedVariant.type}`
      : (product._id || product.id);
    
    // Check if this exact item (with same variant) already exists in cart
    const existingItem = cart.find((item: any) => {
      const itemId = item.product._id || item.product.id;
      const itemVariant = item.selectedVariant?.type;
      if (product.hasVariants && selectedVariant) {
        return itemId === (product._id || product.id) && itemVariant === selectedVariant.type;
      }
      return itemId === (product._id || product.id) && !item.selectedVariant;
    });
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        product: {
          _id: product._id,
          id: product._id || product.id,
          name: product.name,
          price: itemPrice,
          image: (product.hasVariants && selectedVariant && selectedVariant.image) ? selectedVariant.image : product.image,
          category: product.category
        },
        selectedVariant: product.hasVariants && selectedVariant ? {
          type: selectedVariant.type,
          price: selectedVariant.price,
          image: selectedVariant.image || ''
        } : null,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
    localStorage.setItem('cartCount', totalItems.toString());
    window.dispatchEvent(new Event('cartUpdated'));
    
    showToast('Product added to cart!', 'success');
  };
  
  // Get current price based on selected variant
  const getCurrentPrice = () => {
    if (product.hasVariants && selectedVariant) {
      return parseFloat(selectedVariant.price.replace(/[^0-9.]/g, '')) || 0;
    }
    return product.price;
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
              src={
                product.hasVariants && selectedVariant && selectedVariant.image
                  ? selectedVariant.image
                  : product.image
              }
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {/* Variant Badge */}
            {product.hasVariants && selectedVariant && (
              <div className="absolute top-4 left-4 bg-[#009f3b] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                {selectedVariant.type}
              </div>
            )}
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
                {formatPrice(getCurrentPrice())}
                {product.hasVariants && product.variants.length > 1 && (
                  <span className="text-lg text-gray-600 font-normal ml-2">
                    (Select type below)
                  </span>
                )}
              </div>
            </div>
            
            {/* Variant Selection */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Type/Variant *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {product.variants.map((variant: any, index: number) => {
                    const isSelected = selectedVariant?.type === variant.type;
                    const variantImage = variant.image || product.image;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(variant)}
                        className={`group relative border-2 rounded-lg overflow-hidden transition-all ${
                          isSelected
                            ? 'border-[#009f3b] shadow-lg ring-2 ring-[#009f3b] ring-opacity-50'
                            : 'border-gray-300 hover:border-[#009f3b] hover:shadow-md'
                        }`}
                      >
                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-10 bg-[#009f3b] text-white rounded-full p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Variant Image */}
                        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                          <Image
                            src={variantImage}
                            alt={`${product.name} - ${variant.type}`}
                            fill
                            className={`object-cover transition-transform ${
                              isSelected ? 'scale-105' : 'group-hover:scale-105'
                            }`}
                            sizes="(max-width: 640px) 50vw, 33vw"
                            unoptimized
                          />
                          {/* Overlay on hover/select */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#009f3b] bg-opacity-10" />
                          )}
                        </div>
                        
                        {/* Variant Info */}
                        <div className={`p-3 text-left ${isSelected ? 'bg-[#90EE90] bg-opacity-20' : 'bg-white'}`}>
                          <div className="font-semibold text-gray-900 mb-1 text-sm">{variant.type}</div>
                          <div className="text-sm font-bold text-[#009f3b]">
                            {formatPrice(parseFloat(variant.price.replace(/[^0-9.]/g, '')) || 0)}
                          </div>
                          {variant.stock !== undefined && variant.stock > 0 && (
                            <div className="text-xs text-gray-500 mt-1">Stock: {variant.stock}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
                disabled={product.hasVariants && !selectedVariant}
                className={`w-full px-6 py-4 rounded-none font-semibold transition-colors flex items-center justify-center gap-2 text-lg ${
                  product.hasVariants && !selectedVariant
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#009f3b] text-white hover:bg-[#00782d]'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              {product.hasVariants && !selectedVariant && (
                <p className="text-sm text-red-600 mt-2 text-center">Please select a type/variant first</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </main>
  );
}

