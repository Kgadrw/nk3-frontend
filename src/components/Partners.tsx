'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Partner {
  _id?: string;
  id?: string;
  logo: string;
  name?: string;
}

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPartners = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const data = await cachedFetch<any[]>('/api/partners');
        if (isMounted) {
        setPartners(data || []);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
        if (isMounted) {
        setPartners([]);
        }
      } finally {
        if (isMounted) {
        setLoading(false);
        }
      }
    };

    fetchPartners();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <p className="text-gray-500">Loading partners...</p>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null; // Don't show section if no partners
  }

  const shouldScroll = partners.length >= 4;

  return (
    <section className="w-full py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#009f3b] mb-2">
            OUR PARTNERS
          </h2>
        </div>

        {/* Partners - Scrollable if 4+ logos, Grid if less */}
        {shouldScroll ? (
          <div className="relative overflow-hidden">
            <div className="flex animate-slide-logos gap-8 md:gap-12">
              {/* First set of logos */}
              {partners.map((partner) => (
                <div
                  key={partner._id || partner.id}
                  className="flex items-center justify-center p-4 md:p-6 flex-shrink-0 slide-logo-item"
                  style={{ width: '200px' }}
                >
                  <div className="relative w-full h-20 md:h-24">
                    <Image
                      src={partner.logo}
                      alt={partner.name || 'Partner Logo'}
                      fill
                      className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      sizes="200px"
                    />
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner) => (
                <div
                  key={`duplicate-${partner._id || partner.id}`}
                  className="flex items-center justify-center p-4 md:p-6 flex-shrink-0 slide-logo-item"
                  style={{ width: '200px' }}
                >
                  <div className="relative w-full h-20 md:h-24">
                    <Image
                      src={partner.logo}
                      alt={partner.name || 'Partner Logo'}
                      fill
                      className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      sizes="200px"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {partners.map((partner) => (
              <div
                key={partner._id || partner.id}
                className="flex items-center justify-center p-4 md:p-6 bg-transparent"
              >
                <div className="relative w-full h-20 md:h-24">
                  <Image
                    src={partner.logo}
                    alt={partner.name || 'Partner Logo'}
                    fill
                    className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Partners;

