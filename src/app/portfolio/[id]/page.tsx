'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Tag, Building2 } from 'lucide-react';


export default function PortfolioDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/portfolio/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPortfolio({
            ...data,
            fullDescription: data.description,
            features: data.keyFeatures ? data.keyFeatures.split('\n').filter((f: string) => f.trim()) : []
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Image
            src="/loader.gif"
            alt="Loading..."
            width={100}
            height={100}
            className="mx-auto"
            unoptimized
          />
        </div>
      </main>
    );
  }

  if (!portfolio) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-8">The portfolio project you're looking for doesn't exist.</p>
          <Link href="/portfolio" className="inline-flex items-center gap-2 bg-[#009f3b] text-white px-6 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-[#009f3b] hover:text-[#00782d] transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={portfolio.image}
          alt={portfolio.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block bg-[#009f3b] text-white px-4 py-2 text-sm font-semibold uppercase mb-4">
              {portfolio.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {portfolio.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white">
              {portfolio.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{portfolio.location}</span>
                </div>
              )}
              {portfolio.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{portfolio.year}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-4">Project Overview</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {portfolio.fullDescription}
              </p>
            </div>

            {/* Gallery */}
            {portfolio.gallery && Array.isArray(portfolio.gallery) && portfolio.gallery.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-6">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.gallery.map((img: string, index: number) => (
                    <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={img}
                        alt={`${portfolio.title} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {portfolio.features && portfolio.features.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-6">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-[#009f3b] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24 space-y-6">
              <h3 className="text-xl font-bold text-[#009f3b] mb-4">Project Details</h3>
              
              {portfolio.area && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-[#009f3b] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Area</p>
                    <p className="font-semibold text-gray-900">{portfolio.area}</p>
                  </div>
                </div>
              )}

              {portfolio.client && (
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-[#009f3b] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-semibold text-gray-900">{portfolio.client}</p>
                  </div>
                </div>
              )}

              {portfolio.status && (
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#009f3b] rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-gray-900">{portfolio.status}</p>
                  </div>
                </div>
              )}

              {portfolio.year && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#009f3b] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-semibold text-gray-900">{portfolio.year}</p>
                  </div>
                </div>
              )}

              {portfolio.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#009f3b] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{portfolio.location}</p>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <Link
                  href="/contact"
                  className="block w-full bg-[#009f3b] text-white text-center px-6 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

