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
        const res = await fetch(`/api/team/${id}`);
        if (res.ok) {
          const data = await res.json();
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Team Member Not Found</h1>
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
              <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
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
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Bio, Experience, and Contact Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Name and Role */}
            <div className="space-y-2">
              {Array.isArray(member.category) && member.category.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {member.category.map((cat: string, index: number) => (
                    <span key={index} className="inline-block bg-[#009f3b] text-white px-4 py-1 text-xs font-semibold uppercase rounded">
                      {cat}
                    </span>
                  ))}
                </div>
              ) : member.category ? (
                <span className="inline-block bg-[#009f3b] text-white px-4 py-1 text-xs font-semibold uppercase rounded">
                  {member.category}
                </span>
              ) : (
                <span className="inline-block bg-[#009f3b] text-white px-4 py-1 text-xs font-semibold uppercase rounded">
                  Team Member
                </span>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {member.name}
              </h1>
              <p className="text-xl md:text-2xl text-[#009f3b] font-medium">
                {member.role || member.position}
              </p>
            </div>

            {/* Bio Section */}
            {member.description && (
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Bio
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {member.description}
                  </p>
                </div>
              </div>
            )}

            {/* Experience Section */}
            {member.experience && (
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b]">Experience</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {member.experience}
                  </p>
                </div>
              </div>
            )}

            {/* Education Section */}
            {member.education && (
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b]">Education</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {member.education}
                  </p>
                </div>
              </div>
            )}

            {/* Certification Section */}
            {member.certification && (
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b]">Certification</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {member.certification}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                {member.phone && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-[#009f3b] text-white p-3 rounded-lg flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <a
                        href={`tel:${member.phone}`}
                        className="text-lg font-semibold text-gray-900 hover:text-[#009f3b] transition-colors"
                      >
                        {member.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {member.email && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-[#009f3b] text-white p-3 rounded-lg flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-lg font-semibold text-gray-900 hover:text-[#009f3b] transition-colors break-all"
                      >
                        {member.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {member.linkedin && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-[#009f3b] text-white p-3 rounded-lg flex-shrink-0">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-gray-900 hover:text-[#009f3b] transition-colors break-all"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#009f3b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00782d] transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                )}
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

