'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  
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
          // Start at main product image (index 0)
          setCurrentSlideIndex(0);
          setSelectedVariant(null);
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

  // Update selected variant when slide changes
  useEffect(() => {
    if (!product) return;
    
    if (currentSlideIndex === 0) {
      // Main product image - no variant selected
      setSelectedVariant(null);
    } else if (product.hasVariants && product.variants && product.variants.length > 0) {
      // Variant image - set corresponding variant
      const variantIndex = currentSlideIndex - 1;
      if (variantIndex >= 0 && variantIndex < product.variants.length) {
        setSelectedVariant(product.variants[variantIndex]);
      }
    }
  }, [currentSlideIndex, product]);

  // Sync carousel scroll with currentSlideIndex
  useEffect(() => {
    if (carouselRef.current) {
      isScrollingRef.current = true;
      const slideWidth = carouselRef.current.offsetWidth;
      const targetScroll = currentSlideIndex * slideWidth;
      
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        }
      });
      
      // Reset flag after scroll completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
  }, [currentSlideIndex]);

  // Get all images for carousel (main product + variants)
  const getCarouselImages = () => {
    if (!product) return [];
    
    const images: Array<{ src: string; alt: string; variant?: any }> = [
      { src: product.image, alt: product.name, variant: null }
    ];
    
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      product.variants.forEach((variant: any) => {
        images.push({
          src: variant.image || product.image,
          alt: `${product.name} - ${variant.type}`,
          variant: variant
        });
      });
    }
    
    return images;
  };

  const carouselImages = getCarouselImages();

  // Navigation functions
  const goToSlide = (index: number) => {
    if (index >= 0 && index < carouselImages.length && index !== currentSlideIndex) {
      isScrollingRef.current = true;
      setCurrentSlideIndex(index);
      
      if (carouselRef.current) {
        const slideWidth = carouselRef.current.offsetWidth;
        const targetScroll = index * slideWidth;
        
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
          if (carouselRef.current) {
            carouselRef.current.scrollTo({
              left: targetScroll,
              behavior: 'smooth'
            });
          }
        });
      }
      
      // Reset flag after scroll completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    }
  };

  const nextSlide = () => {
    const nextIndex = (currentSlideIndex + 1) % carouselImages.length;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentSlideIndex === 0 ? carouselImages.length - 1 : currentSlideIndex - 1;
    goToSlide(prevIndex);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swipe left - next slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous slide
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
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

  const addToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Determine the price and image to use based on current slide
    const isMainProduct = currentSlideIndex === 0;
    const itemPrice = isMainProduct 
      ? product.price
      : (selectedVariant ? parseFloat(selectedVariant.price.replace(/[^0-9.]/g, '')) || 0 : product.price);
    
    const itemImage = isMainProduct
      ? product.image
      : (selectedVariant && selectedVariant.image ? selectedVariant.image : product.image);
    
    // Create unique key for cart item (product ID + variant type if applicable)
    const itemKey = isMainProduct
      ? `${product._id || product.id}_main`
      : `${product._id || product.id}_${selectedVariant?.type || 'variant'}`;
    
    // Check if this exact item (with same variant) already exists in cart
    const existingItem = cart.find((item: any) => {
      const itemId = item.product._id || item.product.id;
      const itemVariant = item.selectedVariant?.type;
      if (isMainProduct) {
        return itemId === (product._id || product.id) && !item.selectedVariant;
      } else {
        return itemId === (product._id || product.id) && itemVariant === selectedVariant?.type;
      }
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
          image: itemImage,
          category: product.category
        },
        selectedVariant: isMainProduct ? null : (selectedVariant ? {
          type: selectedVariant.type,
          price: selectedVariant.price,
          image: selectedVariant.image || ''
        } : null),
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
    localStorage.setItem('cartCount', totalItems.toString());
    window.dispatchEvent(new Event('cartUpdated'));
    
    const itemName = isMainProduct ? product.name : `${product.name} - ${selectedVariant?.type || 'Variant'}`;
    showToast(`${itemName} added to cart!`, 'success');
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
          {/* Product Image Carousel */}
          <div className="relative w-full space-y-4">
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {/* Image Carousel */}
              <div
                ref={carouselRef}
                className="flex overflow-hidden snap-x snap-mandatory scrollbar-hide"
                style={{
                  scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onScroll={(e) => {
                  // Only update if not programmatically scrolling
                  if (isScrollingRef.current) return;
                  
                  const target = e.currentTarget;
                  const slideWidth = target.offsetWidth;
                  const scrollLeft = target.scrollLeft;
                  const newIndex = Math.round(scrollLeft / slideWidth);
                  
                  if (newIndex !== currentSlideIndex && newIndex >= 0 && newIndex < carouselImages.length) {
                    setCurrentSlideIndex(newIndex);
                  }
                }}
              >
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-square flex-shrink-0 snap-center transition-opacity duration-300"
                    style={{
                      minWidth: '100%',
                      width: '100%',
                    }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {carouselImages.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg transition-all z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg transition-all z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Slide Indicators */}
              {carouselImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlideIndex
                          ? 'bg-[#009f3b] w-8'
                          : 'bg-white bg-opacity-50 w-2 hover:bg-opacity-75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Variant Type Display Below Image */}
            <div className="text-center">
              {currentSlideIndex === 0 ? (
                <div className="space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-[#009f3b]">
                    {product.name}
                  </div>
                  <div className="text-xl md:text-2xl font-semibold text-gray-700">
                    Main Product
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-[#009f3b]">
                    {formatPrice(product.price)}
                  </div>
                </div>
              ) : (
                selectedVariant && (
                  <div className="space-y-2">
                    <div className="text-2xl md:text-3xl font-bold text-[#009f3b]">
                      {product.name}
                    </div>
                    <div className="text-xl md:text-2xl font-semibold text-gray-700">
                      Type: {selectedVariant.type}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#009f3b]">
                      {formatPrice(parseFloat(selectedVariant.price.replace(/[^0-9.]/g, '')) || 0)}
                    </div>
                    {selectedVariant.stock !== undefined && selectedVariant.stock > 0 && (
                      <div className="text-sm text-gray-600 mt-2">
                        Stock: {selectedVariant.stock} available
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
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
              {product.hasVariants && product.variants.length > 0 && (
                <p className="text-lg text-gray-600 mb-6">
                  Slide through images to see {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
                </p>
              )}
            </div>
            
            {/* Variant Thumbnails - Quick Navigation */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Available Variants ({product.variants.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Main product thumbnail */}
                  <button
                    onClick={() => goToSlide(0)}
                    className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${
                      currentSlideIndex === 0
                        ? 'ring-2 ring-[#009f3b] ring-opacity-50 shadow-lg scale-105'
                        : 'hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform ${
                          currentSlideIndex === 0 ? 'scale-105' : 'group-hover:scale-105'
                        }`}
                        sizes="(max-width: 640px) 50vw, 33vw"
                        unoptimized
                      />
                      {currentSlideIndex === 0 && (
                        <div className="absolute inset-0 bg-[#009f3b] bg-opacity-10" />
                      )}
                    </div>
                    <div className={`p-2 text-center ${currentSlideIndex === 0 ? 'bg-[#90EE90] bg-opacity-20' : 'bg-white'}`}>
                      <div className="text-xs font-semibold text-gray-900">Main</div>
                    </div>
                  </button>
                  
                  {/* Variant thumbnails */}
                  {product.variants.map((variant: any, index: number) => {
                    const slideIndex = index + 1;
                    const isSelected = currentSlideIndex === slideIndex;
                    const variantImage = variant.image || product.image;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => goToSlide(slideIndex)}
                        className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${
                          isSelected
                            ? 'ring-2 ring-[#009f3b] ring-opacity-50 shadow-lg scale-105'
                            : 'hover:shadow-md hover:scale-105'
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
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#009f3b] bg-opacity-10" />
                          )}
                        </div>
                        
                        {/* Variant Info */}
                        <div className={`p-2 text-center ${isSelected ? 'bg-[#90EE90] bg-opacity-20' : 'bg-white'}`}>
                          <div className="font-semibold text-gray-900 text-xs">{variant.type}</div>
                          <div className="text-xs font-bold text-[#009f3b]">
                            {formatPrice(parseFloat(variant.price.replace(/[^0-9.]/g, '')) || 0)}
                          </div>
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
                className="w-full px-6 py-4 rounded-none font-semibold transition-colors flex items-center justify-center gap-2 text-lg bg-[#009f3b] text-white hover:bg-[#00782d]"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {currentSlideIndex === 0 
                  ? 'Adding main product to cart'
                  : `Adding ${selectedVariant?.type || 'variant'} to cart`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </main>
  );
}

