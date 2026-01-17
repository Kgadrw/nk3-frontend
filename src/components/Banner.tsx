'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const TypingText = ({ text, delay = 100, startDelay = 0, className }: { text: string; delay?: number; startDelay?: number; className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (hasStarted && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [hasStarted, currentIndex, text, delay]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  );
};

const Banner = () => {
  const [companyProfilePdf, setCompanyProfilePdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCompanyProfile = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const data = await cachedFetch<any>('/api/social');
        if (isMounted && data && data.companyProfilePdf) {
          setCompanyProfilePdf(data.companyProfilePdf);
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
      } finally {
        if (isMounted) {
        setLoading(false);
        }
      }
    };

    fetchCompanyProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative w-full min-h-[300px] md:min-h-[350px] px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Left Section - Dark Green Theme */}
      <div className="relative min-h-[300px] md:min-h-[350px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {/* Placeholder for construction worker image - replace with actual image */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="text-white/10 text-6xl">👷</div>
            </div>
          </div>
          {/* Dark Green Overlay */}
          <div className="absolute inset-0 bg-[#009f3b] opacity-80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-20 lg:px-24 xl:px-28 py-6 md:py-8">
          <p className="text-[#90EE90] text-xs font-medium uppercase tracking-wide mb-4">
            WHY CHOOSE US?
          </p>
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
            Make The World Better Place With Construction Quality
          </h2>
        </div>
      </div>

      {/* Right Section - Light Green/Teal Theme */}
      <div className="relative min-h-[300px] md:min-h-[350px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {/* Placeholder for urban landscape image - replace with actual image */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="text-gray-600/20 text-6xl">🏗️</div>
            </div>
          </div>
          {/* Light Green/Teal Overlay */}
          <div className="absolute inset-0 bg-[#90EE90] opacity-60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 py-6 md:py-8">
          <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-[#009f3b] leading-tight mb-2 min-h-[1.2em]">
            <TypingText text="Bringing Your Ideas" delay={80} />
          </h2>
          <h3 className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-[#009f3b] leading-tight mb-8 min-h-[1.2em]">
            <TypingText text="Innovations to Life" delay={80} startDelay={2000} />
          </h3>
          {companyProfilePdf ? (
            <a
              href={companyProfilePdf}
              download
              className="bg-[#009f3b] text-white px-6 py-3 md:px-8 md:py-4 rounded-none font-bold uppercase hover:bg-[#00782d] transition-colors shadow-lg text-xs md:text-sm w-fit inline-block text-center"
            >
              DOWNLOAD OUR PROFILE
            </a>
          ) : (
            <button 
              disabled
              className="bg-gray-400 text-white px-6 py-3 md:px-8 md:py-4 rounded-none font-bold uppercase cursor-not-allowed shadow-lg text-xs md:text-sm w-fit"
            >
              DOWNLOAD OUR PROFILE
            </button>
          )}
        </div>
      </div>
      </div>
    </section>
  );
};

export default Banner;

