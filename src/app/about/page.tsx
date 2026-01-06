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
  const [values, setValues] = useState<any[]>([]);
  
  
  // Initialize all values as expanded by default
  const [expandedValues, setExpandedValues] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        const [aboutRes, partnersRes, servicesRes, valuesRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/partners'),
          fetch('/api/services'),
          fetch('/api/values')
        ]);
        
        const aboutData = await aboutRes.json();
        const partnersData = await partnersRes.json();
        const servicesData = await servicesRes.json();
        const valuesData = await valuesRes.json();
        
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
        setValues(valuesData || []);
        
        // Initialize expanded values state
        const initialExpanded: { [key: string]: boolean } = {};
        (valuesData || []).forEach((value: any) => {
          initialExpanded[value._id || value.id] = true;
        });
        setExpandedValues(initialExpanded);
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
          {aboutContent.aboutImage && (
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
              <Image
                src={aboutContent.aboutImage}
                alt="About Us"
                fill
                className="object-cover"
                priority
              />
              {/* Green opacity overlay */}
              <div className="absolute inset-0 bg-[#009f3b] opacity-20"></div>
            </div>
          )}

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
                
                {values.length > 0 ? (
                  <div className="space-y-0 border border-gray-200">
                    {values.map((value: any, index: number) => (
                      <div key={value._id || value.id}>
                        <button
                          onClick={() => toggleValue(value._id || value.id)}
                          className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="text-base md:text-lg font-bold text-[#009f3b] uppercase">
                            {value.label}
                          </span>
                          <span className="text-[#009f3b] flex-shrink-0 ml-4">
                            {expandedValues[value._id || value.id] ? (
                              <Minus className="w-5 h-5" />
                            ) : (
                              <Plus className="w-5 h-5" />
                            )}
                          </span>
                        </button>
                        {expandedValues[value._id || value.id] && (
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
                ) : (
                  <p className="text-gray-500 text-center py-8">No values and traits available yet.</p>
                )}
              </div>
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
