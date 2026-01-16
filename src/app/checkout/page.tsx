'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Lock, CheckCircle } from 'lucide-react';
import Footer from '@/components/Footer';
import { ToastContainer, Toast, ToastType } from '@/components/Toast';

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

type PaymentMethod = {
  _id?: string;
  id?: string;
  name: string;
  type: string;
  accountName?: string;
  accountNumber?: string;
  provider?: string;
  instructions?: string;
  isActive: boolean;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notes: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  
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
    // Load cart from localStorage
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart:', error);
        }
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch payment methods
    const fetchPaymentMethods = async () => {
      try {
        const res = await fetch('/api/payment');
        const data = await res.json();
        // Only show active payment methods
        const activeMethods = (data || []).filter((pm: PaymentMethod) => pm.isActive !== false);
        setPaymentMethods(activeMethods);
        if (activeMethods.length > 0) {
          setSelectedPayment(activeMethods[0]._id || activeMethods[0].id || '');
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };
    fetchPaymentMethods();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayment) {
      showToast('Please select a payment method', 'warning');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          product: {
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            category: item.product.category,
            productId: item.product._id || item.product.id
          },
          quantity: item.quantity
        })),
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city || '',
          country: formData.country || ''
        },
        paymentMethod: {
          methodId: selectedPayment,
          methodName: selectedPaymentMethod?.name || ''
        },
        notes: formData.notes || '',
        subtotal: getTotalPrice()
      };

      // Send order to backend
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        setOrderPlaced(true);
        
        // Clear cart after successful order
        setTimeout(() => {
          localStorage.removeItem('cart');
          localStorage.setItem('cartCount', '0');
          window.dispatchEvent(new Event('cartUpdated'));
        }, 3000);
      } else {
        const errorData = await res.json();
        showToast(`Error placing order: ${errorData.error || 'Please try again'}`, 'error');
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      showToast('Error placing order. Please try again.', 'error');
    }
  };

  const selectedPaymentMethod = paymentMethods.find(pm => (pm._id || pm.id) === selectedPayment);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Image
            src="/loader.gif"
            alt="Loading..."
            width={100}
            height={100}
            className="mx-auto"
            unoptimized
          />
        </div>
        <Footer />
      </main>
    );
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-[#009f3b] hover:text-[#00782d] transition-colors font-medium mb-6">
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Please add items to your cart before checkout.</p>
              <Link
                href="/shop"
                className="inline-block bg-[#009f3b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#00782d] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-[#009f3b]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-8">Thank you for your order. We will contact you shortly to confirm your order details.</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-[#009f3b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#00782d] transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
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
          <Link href="/cart" className="inline-flex items-center gap-2 text-[#009f3b] hover:text-[#00782d] transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <Lock className="w-8 h-8 text-[#009f3b]" />
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Order Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                    placeholder="Any special instructions or notes..."
                  />
                </div>

                {/* Payment Methods */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                  {paymentMethods.length === 0 ? (
                    <p className="text-gray-500 text-sm">No payment methods available. Please contact us.</p>
                  ) : (
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div
                          key={method._id || method.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedPayment === (method._id || method.id)
                              ? 'border-[#009f3b] bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPayment(method._id || method.id || '')}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method._id || method.id}
                              checked={selectedPayment === (method._id || method.id)}
                              onChange={() => setSelectedPayment(method._id || method.id || '')}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{method.name}</h3>
                              {method.provider && (
                                <p className="text-sm text-gray-600 mb-2">Provider: {method.provider}</p>
                              )}
                              {method.accountName && (
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Account Name:</span> {method.accountName}
                                </p>
                              )}
                              {method.accountNumber && (
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Account Number:</span> {method.accountNumber}
                                </p>
                              )}
                              {method.instructions && (
                                <p className="text-sm text-gray-600 mt-2 italic">{method.instructions}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#009f3b] text-white py-4 rounded-lg font-semibold hover:bg-[#00782d] transition-colors text-lg mt-6"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product._id || item.product.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                        loading="lazy"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#009f3b] mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">Calculated separately</span>
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

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-5 h-5 text-[#009f3b]" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </main>
  );
}

