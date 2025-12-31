'use client';

import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState({
    title: 'ABOUT NK 3D ARCHITECTURE STUDIO',
    description1: 'We are a design and construction consultancy company established in 2016, specializing in planning, design and management of architectural, engineering and interior design projects practicing in Kigali Rwanda.',
    description2: 'The firm has a skilled team consisting of architects, engineers, quantity surveyors, technicians, designers, specialist consultants and support staff that are able to offer quality consultancy services on all types of construction work.',
    aboutImage: '/about.jpg',
    aim: 'Our aim is to give the most in sync design for our projects in relation to cost, time & quality while respecting environmental, cultural and technical concerns all through while both preserving sustainability & context, and follow where innovations leads us.',
  });
  const [partners, setPartners] = useState<any[]>([]);
  const [expandedValues, setExpandedValues] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  const values = [
    { id: 'integrity', label: 'INTEGRITY', description: 'We maintain the highest standards of honesty, transparency, and ethical conduct in all our professional relationships and project deliveries.' },
    { id: 'passionate', label: 'PASSIONATE', description: 'Our team is driven by a genuine passion for architecture and design, bringing enthusiasm and dedication to every project we undertake.' },
    { id: 'adaptability', label: 'ADAPTABILITY', description: 'We embrace change and innovation, adapting our approaches to meet evolving client needs, technological advancements, and industry best practices.' },
  ];

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        const [aboutRes, partnersRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/partners')
        ]);
        
        const aboutData = await aboutRes.json();
        const partnersData = await partnersRes.json();
        
        // Check if data exists and has properties
        if (aboutData && Object.keys(aboutData).length > 0) {
          setAboutContent({
            title: aboutData.title || aboutData.homeHeading || 'ABOUT NK 3D ARCHITECTURE STUDIO',
            description1: aboutData.description1 || aboutData.homeDescription1 || aboutData.paragraph1 || 'We are a design and construction consultancy company established in 2016, specializing in planning, design and management of architectural, engineering and interior design projects practicing in Kigali Rwanda.',
            description2: aboutData.description2 || aboutData.homeDescription2 || aboutData.paragraph2 || 'The firm has a skilled team consisting of architects, engineers, quantity surveyors, technicians, designers, specialist consultants and support staff that are able to offer quality consultancy services on all types of construction work.',
            aboutImage: aboutData.aboutImage || aboutData.homeImage || '/about.jpg',
            aim: aboutData.aim || aboutData.paragraph3 || 'Our aim is to give the most in sync design for our projects in relation to cost, time & quality while respecting environmental, cultural and technical concerns all through while both preserving sustainability & context, and follow where innovations leads us.',
          });
        }
        
        setPartners(partnersData || []);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  const toggleValue = (id: string) => {
    setExpandedValues(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center py-12">
            <Image
              src="/loader.gif"
              alt="Loading..."
              width={100}
              height={100}
              className="mx-auto"
              unoptimized
            />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Image at the top */}
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={aboutContent.aboutImage || '/about.jpg'}
              alt="About Us"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - About Section */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-6">
                {aboutContent.title}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-base md:text-lg">
                  <strong className="text-[#009f3b]">NK 3D Architecture Studio</strong> is a <strong className="text-[#009f3b]">design and construction</strong> consultancy company established in 2016, specializing in planning, design and management of architectural, engineering and interior design projects practicing in Kigali Rwanda.
                </p>
                <p className="text-base md:text-lg">
                  {aboutContent.description2}
                </p>
              </div>

              {/* Our Aim Section - Below About */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[#009f3b]"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#009f3b] uppercase whitespace-nowrap">
                    OUR AIM
                  </h3>
                  <div className="flex-1 h-px bg-[#009f3b]"></div>
                </div>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {aboutContent.aim}
                </p>
              </div>
            </div>

            {/* Right Column - Values and Traits */}
            <div className="space-y-8">
              {/* Values and Traits Section */}
              <div>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[#009f3b]"></div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#009f3b] uppercase whitespace-nowrap">
                    VALUES AND TRAITS
                  </h3>
                  <div className="flex-1 h-px bg-[#009f3b]"></div>
                </div>
                
                <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                  {values.map((value, index) => (
                    <div key={value.id}>
                      <button
                        onClick={() => toggleValue(value.id)}
                        className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="text-base md:text-lg font-bold text-[#009f3b] uppercase">
                          {value.label}
                        </span>
                        <span className="text-[#009f3b] flex-shrink-0 ml-4">
                          {expandedValues[value.id] ? (
                            <Minus className="w-5 h-5" />
                          ) : (
                            <Plus className="w-5 h-5" />
                          )}
                        </span>
                      </button>
                      {expandedValues[value.id] && (
                        <div className="px-4 md:px-5 pb-4 md:pb-5 text-gray-700 text-sm md:text-base leading-relaxed">
                          {value.description}
                        </div>
                      )}
                      {index < values.length - 1 && (
                        <div className="h-px bg-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Partner Logos Section */}
          {partners.length > 0 && (
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-8 text-center">
                Our Partners
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {partners.map((partner) => (
                  <div
                    key={partner._id || partner.id}
                    className="flex items-center justify-center p-4 md:p-6"
                  >
                    <div className="relative w-full h-20 md:h-24">
                      <Image
                        src={partner.logo}
                        alt={partner.name || 'Partner Logo'}
                        fill
                        className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
