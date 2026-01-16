'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

const LogoSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Placeholder logos - replace with actual company logos
  const logos = [
    { id: 1, name: 'Company 1', logo: '/next.svg' },
    { id: 2, name: 'Company 2', logo: '/vercel.svg' },
    { id: 3, name: 'Company 3', logo: '/file.svg' },
    { id: 4, name: 'Company 4', logo: '/globe.svg' },
    { id: 5, name: 'Company 5', logo: '/window.svg' },
    { id: 6, name: 'Company 6', logo: '/next.svg' },
    { id: 7, name: 'Company 7', logo: '/vercel.svg' },
    { id: 8, name: 'Company 8', logo: '/file.svg' },
  ];

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollPosition = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset to beginning when reaching halfway (seamless loop)
      if (scrollPosition >= slider.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      slider.scrollLeft = scrollPosition;
    };

    const interval = setInterval(scroll, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-2">
            OUR PORTFOLIO COMPANIES
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Trusted by leading organizations
          </p>
        </div>

        {/* Logo Slider */}
        <div className="relative overflow-hidden">
          <div
            ref={sliderRef}
            className="flex gap-8 md:gap-12 items-center scrollbar-hide"
            style={{
              width: '100%',
              overflowX: 'auto',
              scrollBehavior: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-16 md:h-20 w-32 md:w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                <Image
                  src={logo.logo}
                  alt={logo.name}
                  width={160}
                  height={80}
                  className="object-contain max-h-full max-w-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoSlider;

