'use client';

import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState({
    title: '',
    description1: '',
    description2: '',
    aboutImage: '',
    aim: '',
  });
  const [partners, setPartners] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // Hardcoded values and traits - no backend fetch
  const values = [
    {
      id: '1',
      label: 'INTEGRITY',
      description: 'We maintain the highest ethical standards in all our dealings, ensuring transparency and honesty in every project.'
    },
    {
      id: '2',
      label: 'INNOVATION',
      description: 'We embrace cutting-edge technologies and creative solutions to deliver exceptional architectural designs.'
    },
    {
      id: '3',
      label: 'SUSTAINABILITY',
      description: 'We are committed to environmental responsibility, incorporating green building practices in all our projects.'
    },
    {
      id: '4',
      label: 'EXCELLENCE',
      description: 'We strive for perfection in every detail, ensuring the highest quality in design and construction.'
    },
    {
      id: '5',
      label: 'COLLABORATION',
      description: 'We work closely with clients, partners, and communities to achieve shared goals and visions.'
    }
  ];
  
  // Initialize all values as expanded by default
  const [expandedValues, setExpandedValues] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize expanded values state for hardcoded values
    const initialExpanded: { [key: string]: boolean } = {};
    values.forEach((value: any) => {
      initialExpanded[value.id] = true;
    });
    setExpandedValues(initialExpanded);

    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        const [aboutRes, partnersRes, servicesRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/partners'),
          fetch('/api/services')
        ]);
        
        const aboutData = await aboutRes.json();
        const partnersData = await partnersRes.json();
        const servicesData = await servicesRes.json();
        
        // Only use data from API, no fallbacks or defaults
        if (aboutData && Object.keys(aboutData).length > 0) {
          // Only set values that actually exist in the API response
          setAboutContent({
            title: aboutData.title || aboutData.homeHeading || '',
            description1: aboutData.description1 || aboutData.homeDescription1 || aboutData.paragraph1 || '',
            description2: aboutData.description2 || aboutData.homeDescription2 || aboutData.paragraph2 || '',
            aboutImage: aboutData.aboutImage || aboutData.homeImage || '',
            aim: aboutData.aim || aboutData.paragraph3 || '',
          });
        } else {
          // Ensure empty state if no data
          setAboutContent({
            title: '',
            description1: '',
            description2: '',
            aboutImage: '',
            aim: '',
          });
        }
        
        setPartners(partnersData || []);
        setServices(servicesData || []);
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
          <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src="/about.jpg"
              alt="About Us"
              fill
              className="object-cover"
              priority
            />
            {/* Green opacity overlay */}
            <div className="absolute inset-0 bg-[#009f3b] opacity-20"></div>
          </div>

          {/* NK-3D Architecture Studioz Content */}
          <div className="space-y-6">
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-base md:text-lg">
                NK-3D Architecture Studioz (NKASO Limited) is a forward-thinking design and construction firm dedicated to revolutionizing Rwanda's architectural landscape with innovative and sustainable solutions. Established in 2016 by Nkurikiye Eric, a visionary Architect and Sustainability Consultant, our company merges cutting-edge design with practical construction expertise. Under Eric's guidance, NKASO is setting new benchmarks for architectural excellence in the region.
              </p>
              <p className="text-base md:text-lg whitespace-pre-line">
                In 2021, NKASO Limited achieved a key milestone by officially registering as a private domestic entity with the Government of Rwanda. This evolution was driven by the addition of co-founders Rubimbura Rene Gabin and Maxime BAYINGANA Rutimirwa, fortifying our company's base and expanding our strategic outlook. This registration highlights our steadfast dedication to superior quality and compliance with the highest industry benchmarks.

Based in Kigali- Rwanda, NKASO Limited operates through specialized divisions:

NK-3Darchitects.19 for architectural design, landscaping, interior design, and urban planning;

NK-3Dengineering.19 for comprehensive civil works and project management;

NK-3D Academy.19, which focuses on education, training, research, and sales of academic 3D models and architectural materials, while also training young students in architecture.

We are committed to environmental responsibility, incorporating green building technologies to create aesthetically appealing, functional, and eco-friendly spaces that promote a sustainable future for Rwanda and the wider world.
              </p>
            </div>
          </div>

          {/* Values and Traits Section - Full Width */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 h-px bg-[#009f3b]"></div>
              <h3 className="text-xl md:text-2xl font-bold text-[#009f3b] uppercase whitespace-nowrap">
                VALUES AND TRAITS
              </h3>
              <div className="flex-1 h-px bg-[#009f3b]"></div>
            </div>
            
            {values.length > 0 ? (
              <div className="space-y-0 border border-gray-200">
                {values.map((value: any, index: number) => (
                  <div key={value._id || value.id}>
                    <button
                      onClick={() => toggleValue(value.id || value._id)}
                      className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-base md:text-lg font-bold text-[#009f3b] uppercase">
                        {value.label}
                      </span>
                      <span className="text-[#009f3b] flex-shrink-0 ml-4">
                        {expandedValues[value.id || value._id] ? (
                          <Minus className="w-5 h-5" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                      </span>
                    </button>
                    {expandedValues[value.id || value._id] && value.description && (
                      <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0">
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    )}
                    {index < values.length - 1 && (
                      <div className="h-px bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No values and traits available yet.</p>
              </div>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - About Section */}
            <div className="space-y-6">
              {aboutContent.title && (
                <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-6">
                  {aboutContent.title}
                </h2>
              )}
              {(aboutContent.description1 || aboutContent.description2) && (
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {aboutContent.description1 && (
                    <p className="text-base md:text-lg">
                      {aboutContent.description1}
                    </p>
                  )}
                  {aboutContent.description2 && (
                    <p className="text-base md:text-lg">
                      {aboutContent.description2}
                    </p>
                  )}
                </div>
              )}

              {/* Our Aim Section - Below About */}
              {aboutContent.aim && (
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
              )}
            </div>
          </div>

          {/* Services Section */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex-1 h-px bg-[#009f3b]"></div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#009f3b] uppercase whitespace-nowrap">
                Our Services
              </h3>
              <div className="flex-1 h-px bg-[#009f3b]"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.length > 0 ? services.map((service: any) => {
                return (
                  <div
                    key={service._id || service.id}
                    className="bg-white border border-gray-200 p-6 flex flex-col h-full"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-[#009f3b] mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
                      {service.description}
                    </p>
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2 mb-4 flex-grow">
                        {service.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                            <span className="text-[#009f3b] mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-[#009f3b] text-white px-6 py-2 font-semibold hover:bg-[#00782d] transition-colors mt-auto"
                    >
                      Get a Quote
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              }) : (
                <p className="col-span-full text-center text-gray-500 py-8">No services available yet.</p>
              )}
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
