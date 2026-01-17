'use client';

import { useState, useEffect } from 'react';

export default function Services() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const servicesData = await cachedFetch<any[]>('/api/services');
        setServices(servicesData || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Default services
  const defaultServices = [
    'Feasibility Studies & Project Planning',
    'Architectural & Structural Design',
    'Construction Supervision & Project Management',
    'Environmental & Social Impact Assessments (ESIA)',
    'MEP (Mechanical, Electrical & Plumbing) Engineering',
    'Quantity Surveying & Cost Estimation',
    'Construction Permit Processing & Legal Compliance'
  ];

  // Merge API services and default services, limit to 6 total
  const allServices = [
    ...services,
    ...defaultServices.slice(0, Math.max(0, 6 - services.length)).map(title => ({ title }))
  ].slice(0, 6);

  // Group services into pairs (2 services per card)
  const groupedServices: any[][] = [];
  for (let i = 0; i < allServices.length; i += 2) {
    groupedServices.push(allServices.slice(i, i + 2));
  }
  // Limit to 3 cards total
  const serviceCards = groupedServices.slice(0, 3);

  return (
    <section 
      className="relative py-12 md:py-16 lg:py-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/planing.jpg)',
      }}
    >
      {/* Green Overlay */}
      <div className="absolute inset-0 bg-[#009f3b] opacity-60"></div>
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
            {serviceCards.map((servicePair: any[], cardIndex: number) => {
              return (
                <div
                  key={`service-card-${cardIndex}`}
                  className="bg-white border border-gray-200 shadow-lg p-6 flex flex-col h-full flex-1"
                >
                  {servicePair.map((service: any, serviceIndex: number) => {
                    const key = service._id || service.id || `service-${cardIndex}-${serviceIndex}`;
                    return (
                      <div key={key} className={serviceIndex > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}>
                        <h3 className="text-lg md:text-xl text-gray-800 font-semibold mb-2">
                          {service.title}
                        </h3>
                        {service.description && (
                          <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-2">
                            {service.description}
                          </p>
                        )}
                        {service.features && service.features.length > 0 && (
                          <ul className="space-y-1 mb-2">
                            {service.features.map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700 text-xs">
                                <span className="text-[#009f3b] mt-1">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
