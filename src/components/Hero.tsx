'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

type HeroSlide = {
  id: number;
  image: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  buttonText: string;
};

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
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: HeroSlide[] = [
    {
      id: 1,
      image: '/hero1.webp',
      titlePart1: 'OUR',
      titlePart2: 'FOCUS',
      description: 'Transforming visions into reality—our designs inspire community and elevate the built environment.',
      buttonText: 'OUR SERVICES',
    },
    {
      id: 2,
      image: '/hero2.jfif',
      titlePart1: 'INNOVATIVE',
      titlePart2: 'DESIGNS',
      description: 'Creating sustainable and modern architectural solutions that shape the future of construction.',
      buttonText: 'VIEW PORTFOLIO',
    },
    {
      id: 3,
      image: '/hero2.jfif',
      titlePart1: 'EXCELLENCE',
      titlePart2: 'IN BUILDING',
      description: 'Delivering exceptional quality in every project with precision, creativity, and dedication.',
      buttonText: 'GET STARTED',
    },
  ];

  const currentSlideData = slides[currentSlide];
  const { displayedText: displayedTitle1, isTyping: isTypingTitle1 } = useTypingEffect(currentSlideData.titlePart1, 100);
  const { displayedText: displayedTitle2, isTyping: isTypingTitle2 } = useTypingEffect(
    currentSlideData.titlePart2, 
    100, 
    currentSlideData.titlePart1.length * 100 + 200 // Start after title1 finishes + small delay
  );
  const { displayedText: displayedDescription, isTyping: isTypingDesc } = useTypingEffect(
    currentSlideData.description, 
    30,
    (currentSlideData.titlePart1.length + currentSlideData.titlePart2.length) * 100 + 400 // Start after both titles finish
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // Increased to 8 seconds to allow typing to complete

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image with Green Overlay */}
      <div className="absolute inset-0">
        <Image
          key={currentSlide}
          src={currentSlideData.image}
          alt={currentSlideData.titlePart2}
          fill
          className="object-cover transition-opacity duration-1000"
          priority={currentSlide === 0}
        />
        {/* Green Overlay */}
        <div className="absolute inset-0 bg-[#009f3b] opacity-60 transition-opacity duration-1000"></div>
      </div>

      {/* Content Overlay (Left) */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full flex justify-start pl-2 md:pl-4 lg:pl-6">
          <div className="max-w-2xl text-left">
            {/* Heading */}
            <h1 
              key={`title-${currentSlide}`}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            >
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
            <p 
              key={`desc-${currentSlide}`}
              className="text-white text-sm sm:text-base md:text-lg mb-6 leading-relaxed px-4 md:px-0"
            >
              {displayedDescription}
              {isTypingDesc && <span className="animate-pulse text-[#009f3b]">|</span>}
            </p>

            {/* CTA Button */}
            <button 
              key={`btn-${currentSlide}`}
              className="bg-[#90EE90] text-white px-6 py-3 md:px-8 md:py-4 rounded-none font-semibold uppercase hover:bg-[#7dd87d] transition-colors shadow-lg text-sm md:text-base"
            >
              {currentSlideData.buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

