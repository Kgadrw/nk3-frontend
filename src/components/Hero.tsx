'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  // Hardcoded hero data - no backend fetch
  const heroTexts = [
    {
    titlePart1: 'OUR',
    titlePart2: 'FOCUS',
      description: 'Transforming visions into reality through innovative architectural design and construction excellence.',
      buttonText: 'OUR SERVICES',
      buttonLink: '/contact',
      image: '/hero1.webp'
    },
    {
      titlePart1: 'OUR',
      titlePart2: 'EXPERTISE',
      description: 'Sustainable construction in action building with local materials to create strong foundation for our community\'s future.',
      buttonText: 'OUR SERVICES',
      buttonLink: '/contact',
      image: '/heroo.png'
    },
    {
      titlePart1: 'INTERIOR',
      titlePart2: 'DESIGN',
      description: 'Where elegance meet the nature -- nature designs create harmoniuos spaces that invites the beauty of surroundings indoors, enhancing every moment with breathtaking views.',
      buttonText: 'OUR SERVICES',
      buttonLink: '/contact',
      image: '/interior.png'
    },
    {
      titlePart1: 'REDEFINING',
      titlePart2: 'SKYLINES',
      description: 'Clacking landmark design, that redefines skylines, our innovative approach merges creativity with sustainability.',
    buttonText: 'OUR SERVICES',
      buttonLink: '/contact',
      image: '/hero2.png'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate hero texts - wait for typing to complete + reading time
  useEffect(() => {
    if (heroTexts.length <= 1) return;

    const currentHero = heroTexts[currentIndex];
    
    // Calculate total typing time: title1 + title2 + description + delays
    const title1Time = currentHero.titlePart1.length * 100;
    const title2Delay = title1Time + 200;
    const title2Time = title2Delay + (currentHero.titlePart2.length * 100);
    const descDelay = title2Time + 400;
    const descTime = descDelay + (currentHero.description.length * 30);
    const totalTypingTime = descTime + 1000; // Add 1 second buffer for completion
    
    // After typing completes, wait 4 seconds for reading (reduced from 6), then transition
    const transitionTimeout = setTimeout(() => {
      setIsTransitioning(true);
      const changeTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroTexts.length);
        setIsTransitioning(false);
      }, 500); // Transition duration
      
      return () => clearTimeout(changeTimeout);
    }, totalTypingTime + 4000); // 4 seconds reading time after typing completes (reduced for faster UX)

    return () => clearTimeout(transitionTimeout);
  }, [currentIndex, heroTexts]);

  // Use current hero text
  const currentHero = heroTexts[currentIndex];

  const { displayedText: displayedTitle1, isTyping: isTypingTitle1 } = useTypingEffect(
    currentHero.titlePart1, 
    100,
    isTransitioning ? 1000 : 0
  );
  const { displayedText: displayedTitle2, isTyping: isTypingTitle2 } = useTypingEffect(
    currentHero.titlePart2, 
    100, 
    currentHero.titlePart1.length * 100 + 200
  );
  const { displayedText: displayedDescription, isTyping: isTypingDesc } = useTypingEffect(
    currentHero.description, 
    30,
    (currentHero.titlePart1.length + currentHero.titlePart2.length) * 100 + 400
  );

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] min-h-[300px] md:min-h-[500px] overflow-hidden">
      {/* Background Image with Green Overlay */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
        <Image
              src={currentHero.image}
              alt={currentHero.titlePart2}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          loading={currentIndex === 0 ? "eager" : "lazy"}
              sizes="100vw"
        />
          </motion.div>
        </AnimatePresence>
        {/* Green Overlay */}
        <div className="absolute inset-0 bg-[#009f3b] opacity-60"></div>
      </div>

      {/* Content Overlay (Left) */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full flex justify-start pl-2 md:pl-4 lg:pl-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="max-w-2xl text-left"
            >
            {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
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
              </motion.h1>

            {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-white text-sm sm:text-base md:text-lg mb-6 leading-relaxed px-4 md:px-0"
              >
              {displayedDescription}
              {isTypingDesc && <span className="animate-pulse text-[#009f3b]">|</span>}
              </motion.p>

            {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
            <Link 
                  href={currentHero.buttonLink}
              className="inline-block bg-[#90EE90] text-white px-6 py-3 md:px-8 md:py-4 rounded-none font-semibold uppercase hover:bg-[#7dd87d] transition-colors shadow-lg text-sm md:text-base"
            >
                  {currentHero.buttonText}
            </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
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

