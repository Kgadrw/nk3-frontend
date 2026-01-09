'use client';

import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { ArrowRight, Award, Handshake, Crown, Users, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState({
    aboutImage: '',
    description: '',
  });
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        const [aboutRes, servicesRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/services')
        ]);
        
        const aboutData = await aboutRes.json();
        const servicesData = await servicesRes.json();
        
        // Only use data from API, no fallbacks or defaults
        if (aboutData && Object.keys(aboutData).length > 0) {
          // Only set values that actually exist in the API response
          setAboutContent({
            aboutImage: aboutData.aboutImage || '',
            description: aboutData.description || '',
          });
        } else {
          // Ensure empty state if no data
          setAboutContent({
            aboutImage: '',
            description: '',
          });
        }
        
        setServices(servicesData || []);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

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
      {/* Hero Section */}
      <section className="relative w-full h-[25vh] md:h-[30vh] min-h-[200px] md:min-h-[250px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/architetect.jpg"
            alt="About Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#009f3b] opacity-60"></div>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                <span className="text-white">ABOUT</span>{' '}
                <span className="text-[#90EE90]">US</span>
              </h1>
              <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
                Transforming visions into reality through innovative architectural design and construction excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6 pt-6 md:pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - About Image */}
          <div className="relative w-full h-full min-h-[400px] overflow-hidden">
            {aboutContent.aboutImage ? (
              <Image
                src={aboutContent.aboutImage}
                alt="About Us"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src="/about.jpg"
                alt="About Us"
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-[#009f3b] opacity-20"></div>
          </div>

          {/* Right Column - White Background with About Content */}
          <div className="bg-white p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            {aboutContent.description ? (
              <div className="space-y-4 text-gray-700">
                <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-gray-600">
                  ABOUT US
                </p>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-[#009f3b]">
                  Building for People, Creating for Generations
                </h1>
                <div className="space-y-3 text-sm md:text-base leading-relaxed text-gray-700">
                  <p className="whitespace-pre-line">
                    {aboutContent.description.split('\n\n')[0]}
                  </p>
                  {aboutContent.description.split('\n\n')[1] && (
                    <p className="whitespace-pre-line">
                      {aboutContent.description.split('\n\n')[1]}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-gray-700">
                <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-gray-600">
                  ABOUT US
                </p>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-[#009f3b]">
                  Building for People, Creating for Generations
                </h1>
                <div className="space-y-3 text-sm md:text-base leading-relaxed text-gray-700">
                  <p>
                    NK-3D Architecture Studioz (NKASO Limited) is a forward-thinking design and construction firm dedicated to revolutionizing Rwanda's architectural landscape with innovative and sustainable solutions. Established in 2016 by Nkurikiye Eric, a visionary Architect and Sustainability Consultant, our company merges cutting-edge design with practical construction expertise. Under Eric's guidance, NKASO is setting new benchmarks for architectural excellence in the region.
                  </p>
                  <p>
                    In 2021, NKASO Limited achieved a key milestone by officially registering as a private domestic entity with the Government of Rwanda. This evolution was driven by the addition of co-founders Rubimbura Rene Gabin and Maxime BAYINGANA Rutimirwa, fortifying our company's base and expanding our strategic outlook. This registration highlights our steadfast dedication to superior quality and compliance with the highest industry benchmarks.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remaining Text Section - Two Column Layout */}
      <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6 pt-6 md:pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - White Background with Text */}
          <div className="bg-white p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            {aboutContent.description ? (
              <div className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
                <p className="whitespace-pre-line">
                  {aboutContent.description.split('\n\n').slice(2).join('\n\n')}
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
                <p>
                  In 2021, NKASO Limited achieved a key milestone by officially registering as a private domestic entity with the Government of Rwanda. This evolution was driven by the addition of co-founders Rubimbura Rene Gabin and Maxime BAYINGANA Rutimirwa, fortifying our company's base and expanding our strategic outlook. This registration highlights our steadfast dedication to superior quality and compliance with the highest industry benchmarks.
                </p>
                <p>
                  Based in Kigali- Rwanda, NKASO Limited operates through specialized divisions: NK-3Darchitects.19 for architectural design, landscaping, interior design, and urban planning; NK-3Dengineering.19 for comprehensive civil works and project management; NK-3D Academy.19, which focuses on education, training, research, and sales of academic 3D models and architectural materials, while also training young students in architecture.
                </p>
                <p>
                  We are committed to environmental responsibility, incorporating green building technologies to create aesthetically appealing, functional, and eco-friendly spaces that promote a sustainable future for Rwanda and the wider world.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Construction Image */}
          <div className="relative w-full h-full min-h-[400px] overflow-hidden">
            <Image
              src="/construct.jpg"
              alt="Construction"
              fill
              className="object-cover"
              priority
              onError={(e) => {
                // Fallback to about image if construction image doesn't exist
                (e.target as HTMLImageElement).src = '/about.jpg';
              }}
            />
            <div className="absolute inset-0 bg-[#009f3b] opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Rest of Content */}
      <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Why Choose Us Section */}
          <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-8">
                {/* Left - Heading */}
                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700 mb-4">
                    WHY CHOOSE US
                  </h3>
                </div>
                {/* Right - Description */}
                <div className="flex items-center">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    We deliver superior projects with unmatched quality and innovation, backed by an experienced team and strategic partnerships. Our commitment to excellence sets us apart.
                  </p>
                </div>
              </div>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                {/* Card 1 - Proven Track Record */}
                <div className="bg-[#90EE90] p-6 flex flex-col items-center text-center">
                  <Award className="w-12 h-12 md:w-16 md:h-16 text-white mb-4" strokeWidth={1.5} />
                  <p className="text-[#009f3b] text-sm md:text-base font-medium">
                    Proven track record of successful projects
                  </p>
                </div>
                
                {/* Card 2 - Strategic Partnerships */}
                <div className="bg-[#90EE90] p-6 flex flex-col items-center text-center">
                  <Handshake className="w-12 h-12 md:w-16 md:h-16 text-white mb-4" strokeWidth={1.5} />
                  <p className="text-[#009f3b] text-sm md:text-base font-medium">
                    Strategic partnerships with industry leaders
                  </p>
                </div>
                
                {/* Card 3 - Comprehensive Services */}
                <div className="bg-[#90EE90] p-6 flex flex-col items-center text-center">
                  <Crown className="w-12 h-12 md:w-16 md:h-16 text-white mb-4" strokeWidth={1.5} />
                  <p className="text-[#009f3b] text-sm md:text-base font-medium">
                    Comprehensive service offerings
                  </p>
                </div>
                
                {/* Card 4 - Experienced Team */}
                <div className="bg-[#90EE90] p-6 flex flex-col items-center text-center">
                  <Users className="w-12 h-12 md:w-16 md:h-16 text-white mb-4" strokeWidth={1.5} />
                  <p className="text-[#009f3b] text-sm md:text-base font-medium">
                    Dedicated and experienced team
                  </p>
                </div>
                
                {/* Card 5 - Innovation */}
                <div className="bg-[#90EE90] p-6 flex flex-col items-center text-center">
                  <Lightbulb className="w-12 h-12 md:w-16 md:h-16 text-white mb-4" strokeWidth={1.5} />
                  <p className="text-[#009f3b] text-sm md:text-base font-medium">
                    Commitment to innovation and sustainability
                  </p>
                </div>
              </div>
          </div>

          {/* Services Section */}
          <div className="p-6 md:p-8">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gray-300"></div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-700 uppercase whitespace-nowrap">
                  Our Services
                </h3>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {services.length > 0 ? services.map((service: any) => {
                  return (
                    <div
                      key={service._id || service.id}
                      className="bg-white border border-gray-300 p-6 flex flex-col h-full"
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

        </div>
      </div>
      <Footer />
    </main>
  );
}
