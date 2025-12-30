'use client';

import Image from 'next/image';

const About = () => {
  return (
    <section className="relative w-full min-h-[400px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/info.png"
          alt="About Us Background"
          fill
          className="object-cover"
          priority
        />
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-white/70"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Section - Text Content */}
          <div className="space-y-6">
            {/* Small heading */}
            <p className="text-[#00782d] text-sm md:text-base font-medium uppercase tracking-wide">
              we are here since 2016
            </p>

            {/* Main heading */}
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight">
              <span className="text-[#009f3b]">ABOUT US</span>{' '}
              <span className="text-[#009f3b]/60">NK 3D ARCHITECTURE STUDIO.</span>
            </h2>

            {/* Description paragraphs */}
            <div className="space-y-4 text-[#00782d] text-sm md:text-base leading-relaxed">
              <p>
                We are a design and construction consultancy company established in 2016, specializing in planning, design and management of architectural, engineering and interior design projects practicing in Kigali Rwanda.
              </p>
              <p>
                The firm has a skilled team consisting of architects, engineers, quantity surveyors, technicians, designers, specialist consultants and support staff that are able to offer quality consultancy services on all types of construction work.
              </p>
            </div>

            {/* CTA Button */}
            <button className="bg-[#009f3b] text-white px-6 py-3 md:px-8 md:py-4 rounded-none font-semibold hover:bg-[#00782d] transition-colors shadow-lg mt-6">
              MORE ABOUT US
            </button>
          </div>

          {/* Right Section - Image */}
          <div className="relative h-[300px] md:h-[350px] lg:h-[400px]">
            {/* Photo */}
            <div className="absolute inset-0 rounded-none overflow-hidden">
              <Image
                src="/about.jpg"
                alt="About Us"
                fill
                className="object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

