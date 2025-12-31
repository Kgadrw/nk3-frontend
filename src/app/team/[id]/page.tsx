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

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#009f3b] to-[#00782d] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Member Image */}
            <div className="relative w-64 h-80 md:w-80 md:h-96 flex-shrink-0">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-lg"></div>
              {!imageError ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-white shadow-2xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                </div>
              ) : (
                <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-white shadow-2xl bg-[#009f3b] flex items-center justify-center">
                  <span className="text-white text-8xl font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Member Info */}
            <div className="flex-1 text-center md:text-left text-white">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm font-semibold uppercase mb-4 rounded">
                {member.category || 'Team Member'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {member.name}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6">
                {member.role || member.position}
              </p>
              
              {/* Contact Information */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="text-sm md:text-base">{member.phone}</span>
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm md:text-base">Email</span>
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm md:text-base">LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {member.description && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-4 flex items-center gap-2">
                  <User className="w-6 h-6" />
                  About
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                    {member.description}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Details Card */}
            <div className="bg-gray-50 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-6">Contact Information</h2>
              <div className="space-y-4">
                {member.phone && (
                  <div className="flex items-start gap-4">
                    <div className="bg-[#009f3b] text-white p-3 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
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
                  <div className="flex items-start gap-4">
                    <div className="bg-[#009f3b] text-white p-3 rounded-lg">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
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
                  <div className="flex items-start gap-4">
                    <div className="bg-[#009f3b] text-white p-3 rounded-lg">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24 space-y-6">
              <h3 className="text-xl font-bold text-[#009f3b] mb-4">Member Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Position</p>
                  <p className="text-base font-semibold text-gray-900">{member.role || member.position}</p>
                </div>
                
                {member.category && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <p className="text-base font-semibold text-gray-900 capitalize">{member.category}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="w-full flex items-center justify-center gap-2 bg-[#009f3b] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#00782d] transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#009f3b] text-[#009f3b] px-4 py-3 rounded-lg font-semibold hover:bg-[#009f3b] hover:text-white transition-colors"
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
                    className="w-full flex items-center justify-center gap-2 bg-[#0077b5] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#005885] transition-colors"
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

