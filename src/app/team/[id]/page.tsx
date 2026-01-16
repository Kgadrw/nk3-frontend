'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Phone, Mail, Linkedin, User } from 'lucide-react';
import Footer from '@/components/Footer';

export default function TeamDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const category = searchParams.get('category');
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const data = await cachedFetch<any>(`/api/team/${id}`);
        if (data) {
          setMember({
            ...data,
            id: data._id || data.id,
            role: data.position,
            email: data.linkedin // Using linkedin as email placeholder
          });
        }
      } catch (error) {
        console.error('Error fetching team member:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchMember();
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

  if (!member) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Team Member Not Found</h1>
          <p className="text-gray-600 mb-8">The team member you're looking for doesn't exist.</p>
          <Link 
            href={category ? `/team?category=${category}` : '/team'} 
            className="inline-flex items-center gap-2 bg-[#009f3b] text-white px-6 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Team
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
          <Link 
            href={category ? `/team?category=${category}` : '/team'} 
            className="inline-flex items-center gap-2 text-[#009f3b] hover:text-[#00782d] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Team
          </Link>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column - Image */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                {imageError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-6xl md:text-8xl font-bold">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                    unoptimized
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Bio, Experience, and Contact Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Name and Role */}
            <div className="space-y-2">
              {(() => {
                // Get unique categories
                let categories: string[] = [];
                if (Array.isArray(member.category) && member.category.length > 0) {
                  // Remove duplicates by normalizing and using Set
                  const normalized = member.category.map((cat: string) => cat.toLowerCase().trim());
                  const unique = Array.from(new Set(normalized));
                  categories = unique.map(cat => {
                    // Find original case from member.category
                    const original = member.category.find((c: string) => c.toLowerCase().trim() === cat);
                    return original || cat;
                  });
                } else if (member.category) {
                  categories = [member.category];
                }
                
                if (categories.length > 0) {
                  return (
                <div className="flex flex-wrap gap-2">
                      {categories.map((cat: string, index: number) => (
                        <span key={index} className="inline-block bg-gray-200 text-gray-700 px-4 py-1 text-xs font-semibold uppercase">
                      {cat}
                    </span>
                  ))}
                </div>
                  );
                } else {
                  return (
                    <span className="inline-block bg-gray-200 text-gray-700 px-4 py-1 text-xs font-semibold uppercase">
                  Team Member
                </span>
                  );
                }
              })()}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700">
                {member.name}
              </h1>
              <p className="text-xl md:text-2xl text-[#009f3b] font-medium">
                {member.role || member.position}
              </p>
            </div>

            {/* Bio Section */}
            {member.description && (
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  Bio
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {member.description}
                  </p>
                </div>
              </div>
            )}

            {/* Experience Section */}
            {member.experience && (
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Experience</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {member.experience}
                  </p>
                </div>
              </div>
            )}

            {/* Education Section */}
            {member.education && (
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Education</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {member.education}
                  </p>
                </div>
              </div>
            )}

            {/* Certification Section */}
            {member.certification && (
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Certification</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {member.certification}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              
              <div className="space-y-3">
                {member.phone && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="text-gray-600 flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <a
                        href={`tel:${member.phone}`}
                        className="text-sm text-gray-700 hover:text-gray-700 transition-colors"
                      >
                        {member.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {member.email && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="text-gray-600 flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-sm text-gray-700 hover:text-gray-700 transition-colors break-all"
                      >
                        {member.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {member.linkedin && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="text-gray-600 flex-shrink-0">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">LinkedIn</p>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-700 hover:text-gray-700 transition-colors break-all"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#009f3b] text-[#009f3b] px-6 py-3 rounded-lg font-semibold hover:bg-[#009f3b] hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    Send Email
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#0077b5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#005885] transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    View LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

