'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Custom hook for typing effect
const useTypingEffect = (text: string, speed: number = 50, delay: number = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    const startTyping = () => {
      intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          if (intervalId) clearInterval(intervalId);
        }
      }, speed);
    };

    if (delay > 0) {
      timeoutId = setTimeout(startTyping, delay);
    } else {
      startTyping();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay]);

  return { displayedText, isTyping };
};

const Hero = () => {
  const [heroTexts, setHeroTexts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchHeroTexts = async () => {
      try {
        const res = await fetch('/api/hero');
        const data = await res.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setHeroTexts(data);
        }
      } catch (error) {
        console.error('Error fetching hero texts:', error);
      }
    };

    fetchHeroTexts();
  }, []);

  // Auto-rotate hero texts every 5 seconds
  useEffect(() => {
    if (heroTexts.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroTexts.length);
        setIsTransitioning(false);
      }, 500); // Half of transition duration
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [heroTexts.length]);

  // Use first hero text if available, or fallback to empty
  const currentHero = heroTexts[currentIndex] || null;

  const { displayedText: displayedTitle1, isTyping: isTypingTitle1 } = useTypingEffect(
    currentHero?.titlePart1 || '', 
    100,
    isTransitioning ? 1000 : 0
  );
  const { displayedText: displayedTitle2, isTyping: isTypingTitle2 } = useTypingEffect(
    currentHero?.titlePart2 || '', 
    100, 
    (currentHero?.titlePart1?.length || 0) * 100 + 200
  );
  const { displayedText: displayedDescription, isTyping: isTypingDesc } = useTypingEffect(
    currentHero?.description || '', 
    30,
    ((currentHero?.titlePart1?.length || 0) + (currentHero?.titlePart2?.length || 0)) * 100 + 400
  );

  if (!currentHero) {
    return null; // Don't render if no hero data
  }

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] min-h-[300px] md:min-h-[500px] overflow-hidden">
      {/* Background Image with Green Overlay */}
      <div className="absolute inset-0">
        <Image
          src={currentHero.image || '/hero1.webp'}
          alt={currentHero.titlePart2 || 'Hero'}
          fill
          className="object-cover"
          priority
        />
        {/* Green Overlay */}
        <div className="absolute inset-0 bg-[#009f3b] opacity-60"></div>
      </div>

      {/* Content Overlay (Left) */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full flex justify-start pl-2 md:pl-4 lg:pl-6">
          <div className={`max-w-2xl text-left transition-all duration-500 ${
            isTransitioning ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'
          }`}>
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="text-gray-300">
                {displayedTitle1}
                {isTypingTitle1 && <span className="animate-pulse text-[#009f3b]">|</span>}
              </span>{' '}
              <span className="text-white">
                {displayedTitle2}
                {isTypingTitle2 && <span className="animate-pulse text-[#009f3b]">|</span>}
              </span>
            </h1>

            {/* Description */}
            <p className="text-white text-sm sm:text-base md:text-lg mb-6 leading-relaxed px-4 md:px-0">
              {displayedDescription}
              {isTypingDesc && <span className="animate-pulse text-[#009f3b]">|</span>}
            </p>

            {/* CTA Button */}
            <Link 
              href={currentHero.buttonLink || '/contact'}
              className="inline-block bg-[#90EE90] text-white px-6 py-3 md:px-8 md:py-4 rounded-none font-semibold uppercase hover:bg-[#7dd87d] transition-colors shadow-lg text-sm md:text-base"
            >
              {currentHero.buttonText || 'OUR SERVICES'}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      {heroTexts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {heroTexts.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-[#90EE90] w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;

