'use client';

import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { Award, Handshake, Crown, Users, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { AboutSkeleton } from '@/components/skeletons';

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
        const { cachedFetch } = await import('@/lib/apiCache');
        const aboutData = await cachedFetch<any>('/api/about');
        
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
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const servicesData = await cachedFetch<any[]>('/api/services');
        setServices(servicesData || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchAboutContent();
    fetchServices();
  }, []);

  if (loading) {
    return (
      <>
        <AboutSkeleton />
        <Footer />
      </>
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                <span className="text-white">ABOUT</span>{' '}
                <span className="text-[#90EE90]">US</span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="text-white text-sm sm:text-base md:text-lg leading-relaxed"
              >
                Transforming visions into reality through innovative architectural design and construction excellence.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6 pt-6 md:pt-8 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] gap-4 md:gap-6 lg:gap-8"
        >
          {/* Left Column - About Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full h-full min-h-[400px] overflow-hidden"
          >
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
                src="/about1.jpeg"
              alt="About Us"
              fill
                className="object-cover"
                priority
            />
            )}
            <div className="absolute inset-0 bg-[#009f3b] opacity-20"></div>
          </motion.div>

          {/* Right Column - White Background with About Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 md:p-8 lg:p-10 flex flex-col justify-center"
          >
            {aboutContent.description ? (
              <div className="space-y-4 text-gray-700">
               
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
          </motion.div>
        </motion.div>
      </div>

      {/* Remaining Text Section - Two Column Layout */}
      <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6 pt-6 md:pt-8 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] gap-4 md:gap-6 lg:gap-8"
        >
          {/* Left Column - White Background with Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 md:p-8 lg:p-10 flex flex-col justify-center"
          >
            {aboutContent.description ? (
              <div className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
                <p className="whitespace-pre-line">
                  {aboutContent.description.split('\n\n').slice(2).join('\n\n')}
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
                <p>
                  Based in Kigali- Rwanda, NKASO Limited operates through specialized divisions: NK-3Darchitects.19 for architectural design, landscaping, interior design, and urban planning; NK-3Dengineering.19 for comprehensive civil works and project management; NK-3D Academy.19, which focuses on education, training, research, and sales of academic 3D models and architectural materials, while also training young students in architecture.
                </p>
                <p>
                  We are committed to environmental responsibility, incorporating green building technologies to create aesthetically appealing, functional, and eco-friendly spaces that promote a sustainable future for Rwanda and the wider world.
                </p>
              </div>
            )}
          </motion.div>

          {/* Right Column - Construction Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative w-full h-full min-h-[400px] overflow-hidden"
          >
            <Image
              src="/4.jpg"
              alt="Construction"
              fill
              className="object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback to about image if construction image doesn't exist
                (e.target as HTMLImageElement).src = '/about1.jpeg';
              }}
            />
            <div className="absolute inset-0 bg-[#009f3b] opacity-20"></div>
          </motion.div>
        </motion.div>
            </div>

      {/* Rest of Content */}
      <div className="max-w-7xl mx-auto w-full px-2 md:px-4 lg:px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Why Choose Us Section */}
          <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-8">
                {/* Left - Heading */}
              <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#009f3b] mb-4">
                    OUR SERVICES
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
              {(() => {
                // Default services
                const defaultServices = [
                  'Feasibility Studies & Architectural Design',
                  'Building Construction & Project Management',
                  'MEP (Mechanical, Electrical & Plumbing) Engineering',
                  'Environmental & Social Impact Assessments (ESIA)',
                  'Construction Permit Processing & Legal Compliance'
                ];

                // Merge API services and default services, limit to 5 total
                const allServices = [
                  ...services,
                  ...defaultServices.slice(0, Math.max(0, 5 - services.length)).map(title => ({ title }))
                ].slice(0, 5);

                // Icons array for cards
                const icons = [Award, Handshake, Crown, Users, Lightbulb];
                // Image sources array
                const imageSources = ['/1.jpg', '/2.jpg', '/3.jpg', '/aboutt.jpg', '/5.jpg'];

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    {allServices.map((service: any, index: number) => {
                      const IconComponent = icons[index] || Award;
                      const imageSrc = imageSources[index] || '/1.jpg';
                      const serviceTitle = service.title || service.name || 'Service';
                      
                      return (
                        <motion.div
                          key={service._id || service.id || `service-${index}`}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                          className="relative p-6 flex flex-col items-center text-center min-h-[200px] overflow-hidden"
                        >
                          <Image
                            src={imageSrc}
                            alt={serviceTitle}
                            fill
                            className="object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-[#009f3b] opacity-85"></div>
                          <div className="relative z-10">
                            <IconComponent className="w-12 h-12 md:w-16 md:h-16 text-white mb-4" strokeWidth={1.5} />
                            <p className="text-white text-sm md:text-base font-medium">
                              {serviceTitle}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })()}
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
