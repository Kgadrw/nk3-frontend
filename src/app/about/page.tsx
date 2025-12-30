'use client';

import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState({
    title: 'Our Story, Vision, and Values',
    subtitle: 'Learn about our commitment to excellence, innovation, and the principles that guide our work every day.',
    quote: 'We are dedicated to bringing your visions to life, transforming ideas into impactful architectural experiences. Our team combines creativity, technical expertise, and a deep understanding of local context to deliver projects that exceed expectations.',
    paragraph1: 'We believe in the power of collaboration and creativity. Every project we undertake is a partnership, where we work closely with our clients to understand their unique needs, challenges, and aspirations.',
    paragraph2: 'Our approach is holistic, combining design excellence, technical innovation, and strategic thinking. We don\'t just create buildings; we craft environments that inspire, function seamlessly, and stand the test of time.',
    paragraph3: 'We stay ahead of industry trends, continuously learning and adapting to bring the latest innovations in architecture, engineering, and sustainable design to every project. Our commitment to quality and excellence has made us a trusted partner in Rwanda\'s construction industry.',
    aboutImage: '/about.jpg',
    projectsCount: '100+',
    clientsCount: '50+',
    yearsCount: '010',
  });

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const res = await fetch('/api/about');
        const data = await res.json();
        if (data) {
          setAboutContent({
            title: data.title || aboutContent.title,
            subtitle: data.subtitle || aboutContent.subtitle,
            quote: data.quote || aboutContent.quote,
            paragraph1: data.paragraph1 || aboutContent.paragraph1,
            paragraph2: data.paragraph2 || aboutContent.paragraph2,
            paragraph3: data.paragraph3 || aboutContent.paragraph3,
            aboutImage: data.aboutImage || aboutContent.aboutImage,
            projectsCount: data.projectsCount || aboutContent.projectsCount,
            clientsCount: data.clientsCount || aboutContent.clientsCount,
            yearsCount: data.yearsCount || aboutContent.yearsCount,
          });
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Title Section */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#009f3b] mb-4">
                {aboutContent.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {aboutContent.subtitle}
              </p>
            </div>

            {/* Large Image */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <Image
                src={aboutContent.aboutImage || '/about.jpg'}
                alt="Our Story"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-[#90EE90] w-12 h-12 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#009f3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Quote Section */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-0 text-8xl md:text-9xl font-bold text-[#90EE90]/30 leading-none">
                66
              </div>
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed relative z-10">
                {aboutContent.quote}
              </p>
            </div>

            {/* ABOUT US Block */}
            <div className="bg-[#009f3b] rounded-lg p-6 md:p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h2 className="text-2xl md:text-3xl font-bold">ABOUT US</h2>
              </div>
              <div className="space-y-4 text-gray-200 leading-relaxed">
                <p>{aboutContent.paragraph1}</p>
                <p>{aboutContent.paragraph2}</p>
                <p>{aboutContent.paragraph3}</p>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="text-center md:text-left">
                  <div className="text-4xl md:text-5xl font-bold text-[#009f3b] mb-2">{aboutContent.projectsCount}</div>
                  <div className="text-gray-600 text-sm md:text-base">Projects Completed</div>
                </div>
                <div className="text-center md:text-left border-l-0 md:border-l border-gray-300 pl-0 md:pl-8">
                  <div className="text-4xl md:text-5xl font-bold text-[#009f3b] mb-2">{aboutContent.clientsCount}</div>
                  <div className="text-gray-600 text-sm md:text-base">Satisfied Clients</div>
                </div>
                <div className="text-center md:text-left border-l-0 md:border-l border-gray-300 pl-0 md:pl-8">
                  <div className="text-4xl md:text-5xl font-bold text-[#009f3b] mb-2">{aboutContent.yearsCount}</div>
                  <div className="text-gray-600 text-sm md:text-base">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

