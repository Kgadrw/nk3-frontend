'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Phone, Mail, Linkedin, User, Briefcase, GraduationCap, Award, FileText } from 'lucide-react';
import Footer from '@/components/Footer';

export default function TeamDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const category = searchParams.get('category');
  const [member, setMember] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [allTeamMembersData, setAllTeamMembersData] = useState<any[]>([]);
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

  // Track if we're switching via sidebar (instant switch) to avoid refetch/reload
  const isInternalSwitchRef = useRef(false);

  useEffect(() => {
    // Skip fetch when we've just switched via sidebar - data is already in state
    if (isInternalSwitchRef.current) {
      isInternalSwitchRef.current = false;
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const { cachedFetch } = await import('@/lib/apiCache');
        
        // Fetch current member
        const memberData = await cachedFetch<any>(`/api/team/${id}`);
        if (memberData) {
          const currentMember = {
            ...memberData,
            id: memberData._id || memberData.id,
            role: memberData.position,
            email: memberData.email || memberData.linkedin,
            experience: memberData.experience || '',
            education: memberData.education || '',
            certification: memberData.certification || '',
            description: memberData.description || '',
            phone: memberData.phone || '',
            linkedin: memberData.linkedin || ''
          };
          setMember(currentMember);

          // Fetch all team members to get same category members
          const allMembers = await cachedFetch<any[]>('/api/team');
          if (allMembers && Array.isArray(allMembers)) {
            // Use category from URL if provided, otherwise use member's categories
            let filterCategory: string | null = null;
            if (category) {
              filterCategory = normalizeCategory(category);
            } else {
              // Fallback to member's categories if no URL category
              const memberCategories = Array.isArray(currentMember.category) 
                ? currentMember.category 
                : (currentMember.category ? [currentMember.category] : []);
              
              if (memberCategories.length > 0) {
                filterCategory = normalizeCategory(memberCategories[0]);
              }
            }

            // Filter members by the selected category
            const sameCategoryMembers = allMembers.filter((m: any) => {
              if (m._id === memberData._id || m.id === memberData._id) return false; // Exclude current member
              
              if (!filterCategory) return true; // If no category filter, show all
              
              const mCategories = Array.isArray(m.category) 
                ? m.category 
                : (m.category ? [m.category] : []);
              
              const normalizedMCategories = mCategories.map((cat: string) => 
                normalizeCategory(cat || 'Uncategorized')
              );

              // Check if member has the filtered category
              return normalizedMCategories.includes(filterCategory);
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
            
            // Store all team members for instant switching
            const allProcessed = allMembers.map((m: any) => ({
              ...m,
              id: m._id || m.id,
              name: m.name || 'Unknown',
              position: m.position || '',
              image: m.image || '',
              description: m.description || '',
              experience: m.experience || '',
              education: m.education || '',
              certification: m.certification || '',
              phone: m.phone || '',
              email: m.email || '',
              linkedin: m.linkedin || '',
              category: m.category || []
            }));
            setAllTeamMembersData(allProcessed);
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
  }, [id, category]);

  // Function to switch team member instantly (no reload/refetch)
  const switchTeamMember = (memberId: string) => {
    const newMember = allTeamMembersData.find(m => (m.id === memberId || m._id === memberId));
    if (newMember) {
      // Mark as internal switch so useEffect skips refetch when URL updates
      isInternalSwitchRef.current = true;
      
      const newMemberData = {
        ...newMember,
        id: newMember.id || newMember._id,
        role: newMember.position,
        email: newMember.email || newMember.linkedin,
        experience: newMember.experience || '',
        education: newMember.education || '',
        certification: newMember.certification || '',
        description: newMember.description || '',
        phone: newMember.phone || '',
        linkedin: newMember.linkedin || ''
      };
      setMember(newMemberData);
      setImageError(false);
      
      // Update URL (replaceState avoids triggering Next.js navigation/refetch)
      const categoryParam = category ? `?category=${encodeURIComponent(category)}` : '';
      const newPath = `/team/${memberId}${categoryParam}`;
      window.history.replaceState(null, '', newPath);
      
      // Update sidebar members list - exclude new current member, add previous member back
      const updatedSidebarMembers = allTeamMembersData
        .filter(m => {
          const mId = m.id || m._id;
          return mId !== memberId && mId !== (member?.id || member?._id);
        })
        .filter(m => {
          // Filter by category if category is specified
          if (category) {
            const filterCategory = normalizeCategory(category);
            const mCategories = Array.isArray(m.category) 
              ? m.category 
              : (m.category ? [m.category] : []);
            
            const normalizedMCategories = mCategories.map((cat: string) => 
              normalizeCategory(cat || 'Uncategorized')
            );
            return normalizedMCategories.includes(filterCategory);
          }
          return true;
        })
        .map((m: any) => ({
          ...m,
          id: m.id || m._id,
          name: m.name || 'Unknown',
          position: m.position || '',
          image: m.image || ''
        }));
      
      // Add previous member back to sidebar if it's not the new current member
      if (member && member.id !== memberId) {
        updatedSidebarMembers.push({
          ...member,
          id: member.id || member._id,
          name: member.name || 'Unknown',
          position: member.position || '',
          image: member.image || ''
        });
      }
      
      setTeamMembers(updatedSidebarMembers);
    }
  };

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
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">

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
                      <div
                        key={teamMember.id}
                        onClick={() => switchTeamMember(teamMember.id)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
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
                      </div>
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
              {/* Name and Position under image */}
              <div className="mt-4 space-y-1 text-center">
                <h1 className="text-sm md:text-base font-medium text-gray-700">
                  {member.name}
                </h1>
                <p className="text-xs md:text-sm text-[#009f3b]">
                  {member.role || member.position}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Bio, Experience, and Contact Info */}
          <div className={`${teamMembers.length > 0 ? 'lg:col-span-6' : 'lg:col-span-8'} order-2 lg:order-3 space-y-8`}>
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
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
                  return categories.map((cat: string, index: number) => (
                    <span key={index} className="inline-block bg-gray-200 text-gray-700 px-4 py-1 text-xs font-semibold uppercase">
                      {cat}
                    </span>
                  ));
                } else {
                  return (
                    <span className="inline-block bg-gray-200 text-gray-700 px-4 py-1 text-xs font-semibold uppercase">
                      Team Member
                    </span>
                  );
                }
              })()}
            </div>

            {/* Personal Information Table */}
            {(member.position || member.description || member.experience || member.education || member.certification || member.phone || member.email || member.linkedin) && (
              <div className="space-y-4">
                <div className="border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      {/* Position */}
                      {(member.position || member.role) && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50 w-32">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-600" />
                              Position
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700">
                              {member.position || member.role}
                            </p>
                          </td>
                        </tr>
                      )}

                      {/* Description/Bio */}
                      {member.description && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50 align-top">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-600" />
                              Description
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {member.description}
                            </p>
                          </td>
                        </tr>
                      )}

                      {/* Experience */}
                      {member.experience && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50 align-top">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-gray-600" />
                              Experience
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {member.experience}
                            </p>
                          </td>
                        </tr>
                      )}

                      {/* Education */}
                      {member.education && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50 align-top">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-gray-600" />
                              Education
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {member.education}
                            </p>
                          </td>
                        </tr>
                      )}

                      {/* Certification */}
                      {member.certification && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50 align-top">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-gray-600" />
                              Certification
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {member.certification}
                            </p>
                          </td>
                        </tr>
                      )}

                      {/* Contact Information */}
                      {member.phone && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-600" />
                              Phone
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={`tel:${member.phone}`}
                              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              {member.phone}
                            </a>
                          </td>
                        </tr>
                      )}
                      
                      {member.email && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-600" />
                              Email
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={`mailto:${member.email}`}
                              className="text-sm text-gray-700 hover:text-gray-900 transition-colors break-all"
                            >
                              {member.email}
                            </a>
                          </td>
                        </tr>
                      )}
                      
                      {member.linkedin && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Linkedin className="w-4 h-4 text-gray-600" />
                              LinkedIn
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-700 hover:text-gray-900 transition-colors break-all"
                            >
                              View Profile
                            </a>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

