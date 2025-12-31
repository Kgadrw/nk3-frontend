'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';
import { ToastContainer, Toast, ToastType } from '@/components/Toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('Thank you for your message! We will get back to you soon.', 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await res.json();
        showToast(`Error: ${errorData.error || 'Failed to send message. Please try again.'}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('Error sending message. Please try again.', 'error');
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-[#009f3b] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
            Get in touch with us for inquiries, consultations, or to discuss your next project.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-6">Get in Touch</h2>
              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-8">
                We're here to help you with your architectural and construction needs. Reach out to us through any of the following channels.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#009f3b] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#009f3b] mb-1">Address</h3>
                  <p className="text-gray-700">Kigali, Rwanda</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#009f3b] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#009f3b] mb-1">Phone</h3>
                  <p className="text-gray-700">+(250) 783 206 660</p>
                  <p className="text-gray-700">+250 789 140 125</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#009f3b] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#009f3b] mb-1">Email</h3>
                  <p className="text-gray-700">Info@Nk3dstudio.Rw</p>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#009f3b] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#009f3b] mb-1">Website</h3>
                  <p className="text-gray-700">www.nk3dstudio.rw</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-[#009f3b] mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">Monday - Friday:</span>
                  <span>8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Saturday:</span>
                  <span>9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="project">Project Consultation</option>
                  <option value="quote">Request a Quote</option>
                  <option value="academy">Academy/Research</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#009f3b] text-white px-6 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-6">Our Location</h2>
          <div className="w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d6978.149640339196!2d30.028019!3d-1.9473582!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2srw!4v1767000864134!5m2!1sen!2srw"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </main>
  );
}

