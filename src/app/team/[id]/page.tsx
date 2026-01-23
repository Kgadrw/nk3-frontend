'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Phone, Mail, Linkedin, User, Briefcase, GraduationCap, Award, FileText, Search, MapPin } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');

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
      <main className="min-h-screen bg-[#009f3b]">
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
      <main className="min-h-screen bg-[#009f3b]">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Team Member Not Found</h1>
          <p className="text-gray-600 mb-8">The team member you're looking for doesn't exist.</p>
          <Link 
            href={category ? `/team?category=${category}` : '/team'} 
            className="inline-flex items-center gap-2 bg-[#009f3b] text-white px-6 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#009f3b]">
      {/* Main Content - Layout with Sidebar and Center Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left Sidebar - Other Team Members in Same Category */}
          {teamMembers.length > 0 && (
            <div className="lg:col-span-3 order-3 lg:order-1">
              <div className="sticky top-24">
                <div className="bg-white border-2 border-[#009f3b] rounded-lg p-4">
                  {/* Category Title */}
                  <h3 className="text-xl font-bold text-[#009f3b] mb-4">
                    {(() => {
                      let categories: string[] = [];
                      if (Array.isArray(member.category) && member.category.length > 0) {
                        const normalized = member.category.map((cat: string) => cat.toLowerCase().trim());
                        const unique = Array.from(new Set(normalized));
                        categories = unique.map(cat => {
                          const original = member.category.find((c: string) => c.toLowerCase().trim() === cat);
                          return original || cat;
                        });
                      } else if (member.category) {
                        categories = [member.category];
                      }
                      return categories.length > 0 ? categories[0] : 'Team Members';
                    })()}
                  </h3>
                  
                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search team members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {/* Current Member - Active */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#009f3b] border-2 border-[#009f3b]">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-[#009f3b] flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {member.name}
                        </p>
                        {member.position && (
                          <p className="text-xs text-white/90 truncate">
                            {member.position}
                          </p>
                        )}
                      </div>
                      <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-white/20 border-2 border-white">
                        {imageError ? (
                          <div className="w-full h-full flex items-center justify-center bg-white/10">
                            <span className="text-white text-xs font-bold">
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
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/10">
                            <span className="text-white text-xs font-bold">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Other Team Members */}
                    {teamMembers
                      .filter((teamMember: any) => {
                        if (!searchQuery) return true;
                        const query = searchQuery.toLowerCase();
                        return (
                          teamMember.name.toLowerCase().includes(query) ||
                          (teamMember.position && teamMember.position.toLowerCase().includes(query))
                        );
                      })
                      .map((teamMember: any, index: number) => (
                      <div
                        key={teamMember.id}
                        onClick={() => switchTeamMember(teamMember.id)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-[#009f3b]/30"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009f3b] text-white flex items-center justify-center font-bold text-sm">
                            {index + 2}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 group-hover:text-[#009f3b] transition-colors truncate">
                              {teamMember.name}
                            </p>
                            {teamMember.position && (
                              <p className="text-xs text-gray-600 truncate">
                                {teamMember.position}
                              </p>
                            )}
                          </div>
                          <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
                          {teamMember.image ? (
                            <Image
                              src={teamMember.image}
                              alt={teamMember.name}
                              fill
                              className="object-cover"
                              unoptimized
                              loading="lazy"
                                sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400 text-xs font-bold">
                                {teamMember.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area - Profile Image and Information */}
          <div className={`${teamMembers.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12'} order-1 lg:order-2 bg-white border-2 border-[#009f3b] rounded-lg p-6 md:p-8`}>
            <div className="flex flex-col items-center">
              {/* Profile Image - Centered in Circle */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-[#009f3b] bg-gray-100 mb-8">
                {imageError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-4xl md:text-6xl font-bold">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center"
                    onError={() => setImageError(true)}
                    unoptimized
                    loading="lazy"
                    sizes="(max-width: 768px) 192px, 224px"
                  />
                )}
              </div>

              {/* All Information Below Image */}
              <div className="w-full max-w-4xl space-y-6">
                {/* Contact Information Cards */}
              <div className="space-y-4">
                  {/* Phone Card */}
                {member.phone && (
                    <div className="bg-[#009f3b]/10 rounded-lg p-4 border border-[#009f3b]/20">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                          <p className="text-sm font-semibold text-[#009f3b] mb-1">Phone:</p>
                      <a
                        href={`tel:${member.phone}`}
                            className="text-sm text-gray-700 hover:text-[#009f3b] transition-colors"
                      >
                        {member.phone}
                      </a>
                    </div>
                  </div>
                    </div>
                  )}
                  
                  {/* Email Card */}
                  {member.email && (
                    <div className="bg-[#009f3b]/10 rounded-lg p-4 border border-[#009f3b]/20">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[#009f3b] flex-shrink-0" />
                    <div className="flex-1">
                          <p className="text-sm font-semibold text-[#009f3b] mb-1">Email:</p>
                      <a
                        href={`mailto:${member.email}`}
                            className="text-sm text-gray-700 hover:text-[#009f3b] transition-colors break-all"
                      >
                        {member.email}
                      </a>
                        </div>
                    </div>
                  </div>
                )}
                
                  {/* LinkedIn Card */}
                {member.linkedin && (
                    <div className="bg-[#009f3b]/10 rounded-lg p-4 border border-[#009f3b]/20">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <Linkedin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                          <p className="text-sm font-semibold text-[#009f3b] mb-1">LinkedIn:</p>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                            className="text-sm text-gray-700 hover:text-[#009f3b] transition-colors break-all"
                      >
                        View Profile
                      </a>
                        </div>
                    </div>
                  </div>
                )}
              </div>

                {/* Additional Information Cards */}
                {(member.description || member.experience || member.education || member.certification) && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    {/* Description Card */}
                    {member.description && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-[#009f3b] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 mb-2">Description</p>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {member.description}
                            </p>
              </div>
            </div>
          </div>
                    )}

                    {/* Experience and Education Side by Side */}
                    {(member.experience || member.education) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Experience Card */}
                        {member.experience && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start gap-3">
                              <Briefcase className="w-5 h-5 text-[#009f3b] flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800 mb-2">Experience</p>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                  {member.experience}
                                </p>
        </div>
      </div>
                    </div>
                        )}

                        {/* Education Card */}
                        {member.education && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start gap-3">
                              <GraduationCap className="w-5 h-5 text-[#009f3b] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800 mb-2">Education</p>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                  {member.education}
                                </p>
                              </div>
                    </div>
                          </div>
                        )}
                  </div>
                )}
                
                    {/* Certification Card */}
                    {member.certification && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-[#009f3b] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 mb-2">Certification</p>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {member.certification}
                            </p>
                    </div>
                    </div>
                  </div>
                )}
              </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

