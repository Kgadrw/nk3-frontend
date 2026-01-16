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
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Helper function to normalize category to canonical form
  const normalizeCategory = (category: string): string => {
    const categoryLower = category.toLowerCase().trim();
    const normalizedMap: { [key: string]: string } = {
      'founder': 'founder',
      'company founder': 'founder',
      'company-founder': 'founder',
      'co-founder': 'co-founder',
      'cofounder': 'co-founder',
      'co founder': 'co-founder',
      'technical': 'technical',
      'technical team': 'technical',
      'technical-team': 'technical',
      'advisors': 'advisors',
      'company-advisors': 'advisors',
      'company advisors': 'advisors',
      'advisory': 'advisors',
      'advisory-board': 'advisors',
      'advisory board': 'advisors',
      'advisory team': 'advisors',
      'uncategorized': 'uncategorized',
    };

    if (normalizedMap[categoryLower]) {
      return normalizedMap[categoryLower];
    }

    return categoryLower.replace(/\s+/g, '-');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        
        // Fetch current member
        const memberData = await cachedFetch<any>(`/api/team/${id}`);
        if (memberData) {
          const currentMember = {
            ...memberData,
            id: memberData._id || memberData.id,
            role: memberData.position,
            email: memberData.linkedin
          };
          setMember(currentMember);

          // Fetch all team members to get same category members
          const allMembers = await cachedFetch<any[]>('/api/team');
          if (allMembers && Array.isArray(allMembers)) {
            // Get categories from current member
            const memberCategories = Array.isArray(currentMember.category) 
              ? currentMember.category 
              : (currentMember.category ? [currentMember.category] : []);
            
            // Normalize member categories
            const normalizedMemberCategories = memberCategories.map((cat: string) => 
              normalizeCategory(cat || 'Uncategorized')
            );

            // Filter members that share at least one category with current member
            const sameCategoryMembers = allMembers.filter((m: any) => {
              if (m._id === memberData._id || m.id === memberData._id) return false; // Exclude current member
              
              const mCategories = Array.isArray(m.category) 
                ? m.category 
                : (m.category ? [m.category] : []);
              
              const normalizedMCategories = mCategories.map((cat: string) => 
                normalizeCategory(cat || 'Uncategorized')
              );

              // Check if any category matches
              return normalizedMCategories.some((cat: string) => 
                normalizedMemberCategories.includes(cat)
              );
            });

            // Process and format team members
            const processedMembers = sameCategoryMembers.map((m: any) => ({
              ...m,
              id: m._id || m.id,
              name: m.name || 'Unknown',
              position: m.position || '',
              image: m.image || ''
            }));

            setTeamMembers(processedMembers);
          }
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
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

      {/* Main Content - Three Column Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left Sidebar - Other Team Members in Same Category */}
          {teamMembers.length > 0 && (
            <div className="lg:col-span-3 order-3 lg:order-1">
              <div className="sticky top-24">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                    Other Team Members
                  </h3>
                  <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Current Member - Active */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#009f3b] text-white">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-white/20 border-2 border-white">
                        {imageError ? (
                          <div className="w-full h-full flex items-center justify-center bg-white/10">
                            <span className="text-white text-lg font-bold">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        ) : member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                            unoptimized
                            loading="lazy"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/10">
                            <span className="text-white text-lg font-bold">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {member.name}
                        </p>
                        {member.position && (
                          <p className="text-xs text-white/80 truncate">
                            {member.position}
                          </p>
                        )}
                        <span className="inline-block mt-1 text-xs bg-white/20 text-white px-2 py-0.5 rounded">
                          Current
                        </span>
                      </div>
                    </div>
                    
                    {/* Other Team Members */}
                    {teamMembers.map((teamMember: any) => (
                      <Link
                        key={teamMember.id}
                        href={`/team/${teamMember.id}${category ? `?category=${category}` : ''}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
                          {teamMember.image ? (
                            <Image
                              src={teamMember.image}
                              alt={teamMember.name}
                              fill
                              className="object-cover"
                              unoptimized
                              loading="lazy"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400 text-lg font-bold">
                                {teamMember.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 group-hover:text-[#009f3b] transition-colors truncate">
                            {teamMember.name}
                          </p>
                          {teamMember.position && (
                            <p className="text-xs text-gray-500 truncate">
                              {teamMember.position}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Center Column - Image */}
          <div className={`${teamMembers.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'} order-1 lg:order-2`}>
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
          <div className={`${teamMembers.length > 0 ? 'lg:col-span-6' : 'lg:col-span-8'} order-2 lg:order-3 space-y-8`}>
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

