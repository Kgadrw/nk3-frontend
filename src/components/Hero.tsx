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
  const heroData = {
    image: '/hero1.webp',
    titlePart1: 'OUR',
    titlePart2: 'FOCUS',
    description: 'Transforming visions into reality—our designs inspire community and elevate the built environment.',
    buttonText: 'OUR SERVICES',
  };

  const { displayedText: displayedTitle1, isTyping: isTypingTitle1 } = useTypingEffect(heroData.titlePart1, 100);
  const { displayedText: displayedTitle2, isTyping: isTypingTitle2 } = useTypingEffect(
    heroData.titlePart2, 
    100, 
    heroData.titlePart1.length * 100 + 200 // Start after title1 finishes + small delay
  );
  const { displayedText: displayedDescription, isTyping: isTypingDesc } = useTypingEffect(
    heroData.description, 
    30,
    (heroData.titlePart1.length + heroData.titlePart2.length) * 100 + 400 // Start after both titles finish
  );

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image with Green Overlay */}
      <div className="absolute inset-0">
        <Image
          src={heroData.image}
          alt={heroData.titlePart2}
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
          <div className="max-w-2xl text-left">
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
              href="/contact"
              className="inline-block bg-[#90EE90] text-white px-6 py-3 md:px-8 md:py-4 rounded-none font-semibold uppercase hover:bg-[#7dd87d] transition-colors shadow-lg text-sm md:text-base"
            >
              {heroData.buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

