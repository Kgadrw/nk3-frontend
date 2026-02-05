'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
            price:
              typeof data.price === 'string'
                ? parseFloat(data.price.replace(/[^0-9.]/g, '')) || 0
                : data.price,
            variants: data.variants || [],
            hasVariants: data.hasVariants || (data.variants && data.variants.length > 0),
          };

          setProduct(productData);
          setCurrentSlideIndex(0);
          setSelectedVariant(null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Update selected variant when slide changes
  useEffect(() => {
    if (!product) return;

    if (currentSlideIndex === 0) {
      setSelectedVariant(null);
      return;
    }

    if (product.hasVariants && product.variants?.length) {
      const variantIndex = currentSlideIndex - 1;
      if (variantIndex >= 0 && variantIndex < product.variants.length) {
        setSelectedVariant(product.variants[variantIndex]);
      }
    }
  }, [currentSlideIndex, product]);

  // Sync carousel scroll with currentSlideIndex
  useEffect(() => {
    if (!carouselRef.current) return;

    isScrollingRef.current = true;
    const slideWidth = carouselRef.current.offsetWidth;
    const targetScroll = currentSlideIndex * slideWidth;

    requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    });

    const t = setTimeout(() => {
      isScrollingRef.current = false;
    }, 600);

    return () => clearTimeout(t);
  }, [currentSlideIndex]);

  const getCarouselImages = () => {
    if (!product) return [];

    const images: Array<{ src: string; alt: string; variant?: any }> = [
      { src: product.image, alt: product.name, variant: null },
    ];

    if (product.hasVariants && product.variants?.length) {
      product.variants.forEach((variant: any) => {
        images.push({
          src: variant.image || product.image,
          alt: `${product.name} - ${variant.type}`,
          variant,
        });
      });
    }

    return images;
  };

  const carouselImages = getCarouselImages();

  const goToSlide = (index: number) => {
    if (index < 0 || index >= carouselImages.length || index === currentSlideIndex) return;

    isScrollingRef.current = true;
    setCurrentSlideIndex(index);

    if (!carouselRef.current) return;
    const slideWidth = carouselRef.current.offsetWidth;
    const targetScroll = index * slideWidth;

    requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 600);
  };

  const nextSlide = () => {
    const nextIndex = (currentSlideIndex + 1) % carouselImages.length;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentSlideIndex === 0 ? carouselImages.length - 1 : currentSlideIndex - 1;
    goToSlide(prevIndex);
  };

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

    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();

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
    })
      .format(price)
      .replace('RWF', 'FRW');
  };

  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const isMainProduct = currentSlideIndex === 0;
    const itemPrice = isMainProduct
      ? product.price
      : selectedVariant
        ? parseFloat(selectedVariant.price.replace(/[^0-9.]/g, '')) || 0
        : product.price;

    const itemImage = isMainProduct
      ? product.image
      : selectedVariant?.image
        ? selectedVariant.image
        : product.image;

    const existingItem = cart.find((item: any) => {
      const itemId = item.product._id || item.product.id;
      const itemVariant = item.selectedVariant?.type;

      if (isMainProduct) {
        return itemId === (product._id || product.id) && !item.selectedVariant;
      }

      return itemId === (product._id || product.id) && itemVariant === selectedVariant?.type;
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
          category: product.category,
        },
        selectedVariant: isMainProduct
          ? null
          : selectedVariant
            ? {
                type: selectedVariant.type,
                price: selectedVariant.price,
                image: selectedVariant.image || '',
              }
            : null,
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
    localStorage.setItem('cartCount', totalItems.toString());
    window.dispatchEvent(new Event('cartUpdated'));

    const itemName = isMainProduct ? product.name : `${product.name} - ${selectedVariant?.type || 'Variant'}`;
    showToast(`${itemName} added to cart!`, 'success');
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
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#009f3b] text-white px-6 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
          >
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
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#009f3b] hover:text-[#00782d] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images with Thumbnails */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnail Strip - Left Side (Only show if variants exist) */}
            {product.hasVariants && product.variants?.length > 0 && (
              <div className="flex flex-row md:flex-col gap-2 flex-shrink-0 md:order-1 order-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
                {/* Main product thumbnail */}
                <button
                  onClick={() => {
                    setCurrentSlideIndex(0);
                    setSelectedVariant(null);
                  }}
                  className={`relative w-16 h-16 md:w-20 md:h-20 border rounded overflow-hidden transition-all flex-shrink-0 ${
                    currentSlideIndex === 0
                      ? 'border-[#009f3b] ring-1 ring-[#009f3b]/20'
                      : 'border-gray-300 hover:border-[#009f3b]/50'
                  }`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>

                {/* Variant thumbnails */}
                {product.variants.map((variant: any, index: number) => {
                  const slideIndex = index + 1;
                  const isSelected = currentSlideIndex === slideIndex;
                  const variantImage = variant.image || product.image;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSlideIndex(slideIndex);
                        setSelectedVariant(variant);
                      }}
                      className={`relative w-16 h-16 md:w-20 md:h-20 border rounded overflow-hidden transition-all flex-shrink-0 ${
                        isSelected
                          ? 'border-[#009f3b] ring-1 ring-[#009f3b]/20'
                          : 'border-gray-300 hover:border-[#009f3b]/50'
                      }`}
                    >
                      <Image
                        src={variantImage}
                        alt={`${product.name} - ${variant.type}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#009f3b]/10 flex items-center justify-center">
                          <div className="w-4 h-4 bg-[#009f3b] rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Product Image - Right Side (or top on mobile) */}
            <div className="relative flex-1 aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={
                  currentSlideIndex === 0
                    ? product.image
                    : selectedVariant?.image || product.image
                }
                alt={
                  currentSlideIndex === 0
                    ? product.name
                    : `${product.name} - ${selectedVariant?.type || 'Variant'}`
                }
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Section */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl md:text-4xl font-bold text-[#009f3b]">
                  {currentSlideIndex === 0
                    ? formatPrice(product.price)
                    : selectedVariant
                      ? formatPrice(parseFloat(selectedVariant.price.replace(/[^0-9.]/g, '')) || 0)
                      : formatPrice(product.price)}
                </span>
              </div>
              
              {/* Stock/Quantity Info */}
              <div className="text-sm text-gray-600">
                {currentSlideIndex === 0 ? (
                  product.stock !== undefined && product.stock > 0 ? (
                    <span className="text-green-600 font-medium">{product.stock} available</span>
                  ) : product.stock === 0 ? (
                    <span className="text-red-600 font-medium">Out of stock</span>
                  ) : null
                ) : (
                  selectedVariant?.stock !== undefined && selectedVariant.stock > 0 ? (
                    <span className="text-green-600 font-medium">{selectedVariant.stock} available</span>
                  ) : selectedVariant?.stock === 0 ? (
                    <span className="text-red-600 font-medium">Out of stock</span>
                  ) : null
                )}
              </div>
            </div>

            {/* Selected Variant Info */}
            {selectedVariant && (
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Selected Variant</h2>
                <p className="text-gray-700 font-medium">{selectedVariant.type}</p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Description</h2>
                <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
              </div>
            )}


            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-700 min-w-[80px]">Quantity:</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                onClick={addToCart}
                className="w-full px-6 py-4 rounded-none font-semibold transition-colors flex items-center justify-center gap-2 text-lg bg-[#009f3b] text-white hover:bg-[#00782d] shadow-md hover:shadow-lg"
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
