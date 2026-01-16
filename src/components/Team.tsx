'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

// Team Member Card Component
const TeamMemberCard = ({ member, category }: { member: { id: number | string; name: string; role: string; image: string; phone?: string; email?: string; description?: string }; category?: string | null }) => {
  const [imageError, setImageError] = useState(false);
  const detailUrl = `/team/${member.id}${category && category !== 'all' ? `?category=${category}` : ''}`;

  return (
    <Link href={detailUrl} className="flex flex-col bg-[#009f3b] hover:opacity-90 transition-opacity cursor-pointer">
      {/* Member Portrait */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-2xl font-bold">
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
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
          />
        )}
      </div>

      {/* Member Info - Green Background */}
      <div className="bg-[#009f3b] p-3 md:p-4 flex flex-col flex-grow">
        {/* Name */}
        <h3 className="text-white text-sm md:text-base font-bold mb-1">
          {member.name}
        </h3>
        
        {/* Role/Position */}
        <p 
          className="text-[#90EE90] text-xs md:text-sm mb-2 line-clamp-2"
          title={member.role}
        >
          {member.role}
        </p>
        
        {/* More Button - Only show if description exists */}
        {member.description && member.description.trim() && (
          <div className="mt-auto bg-[#00782d] hover:bg-[#005a1f] text-white px-3 py-1.5 rounded text-xs md:text-sm font-medium transition-colors inline-block text-center">
            More
          </div>
        )}
      </div>
    </Link>
  );
};

const Team = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [teamData, setTeamData] = useState<any[]>([]);
  const [allTeamData, setAllTeamData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasRedirectedRef = useRef(false);

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

  // Helper function to format category name
  const formatCategoryLabel = (category: string): string => {
    if (!category || category === 'All') return 'All';
    const categoryLower = category.toLowerCase();
    const labelMap: { [key: string]: string } = {
      'founder': 'Company Founder',
      'co-founder': 'Co-Founder',
      'cofounder': 'Co-Founder',
      'technical': 'Technical Team',
      'advisors': 'Advisory Board',
      'company-advisors': 'Advisory Board',
      'company advisors': 'Advisory Board',
      'advisory': 'Advisory Board',
      'advisory-board': 'Advisory Board',
      'advisory board': 'Advisory Board',
      'advisory team': 'Advisory Board',
      'uncategorized': 'Uncategorized',
    };

    if (labelMap[categoryLower]) {
      return labelMap[categoryLower];
    }

    return category
      .split(/[\s_-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const data = await cachedFetch<any[]>('/api/team');
        
        // Process team members and group by person name (normalized) to avoid duplicates
        const memberMap = new Map<string, any>();
        
        // Helper to normalize name for comparison
        const normalizeName = (name: string): string => {
          return name.toLowerCase().trim().replace(/\s+/g, ' ');
        };
        
        (data || []).forEach((member: any) => {
          const memberName = member.name || '';
          const normalizedName = normalizeName(memberName);
          const memberId = member._id || member.id;

          // Check if a person with the same name already exists
          if (memberMap.has(normalizedName)) {
            // Person already exists (same name), merge categories
            const existingMember = memberMap.get(normalizedName);
            const existingCategories = Array.isArray(existingMember.category) 
              ? existingMember.category 
              : (existingMember.category ? [existingMember.category] : []);
            
            const newCategories = Array.isArray(member.category) 
            ? member.category 
              : (member.category ? [member.category] : []);
            
            // Combine categories and remove duplicates
            const allCategories = [...new Set([...existingCategories, ...newCategories])];
            
            // Combine role/position with categories
            const baseRole = existingMember.position || member.position || '';
            const categoryLabels = allCategories.map((cat: string) => formatCategoryLabel(cat));
            const combinedRole = categoryLabels.length > 0 
              ? `${baseRole}${baseRole ? ', ' : ''}${categoryLabels.join(', ')}`
              : baseRole;
            
            // Keep the member with the most complete data (prefer one with image, description, etc.)
            const betterMember = member.image && !existingMember.image ? member : existingMember;
            
            memberMap.set(normalizedName, {
              ...betterMember,
              id: existingMember.id || memberId, // Keep original ID
              name: existingMember.name || memberName, // Keep original name
              category: allCategories,
              role: combinedRole,
              position: combinedRole
          });
          } else {
            // New person, add to map
            const categories = Array.isArray(member.category) 
              ? member.category 
              : (member.category ? [member.category] : []);
            
            const categoryLabels = categories.map((cat: string) => formatCategoryLabel(cat));
            const baseRole = member.position || '';
            const combinedRole = categoryLabels.length > 0 
              ? `${baseRole}${baseRole ? ', ' : ''}${categoryLabels.join(', ')}`
              : baseRole;
            
            memberMap.set(normalizedName, {
              ...member,
              id: memberId,
              role: combinedRole,
              position: combinedRole,
              email: member.linkedin,
              category: categories
            });
          }
        });

        const processedMembers = Array.from(memberMap.values());
        setAllTeamData(processedMembers);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // Filter team members by category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    
    if (!categoryParam || categoryParam === 'all') {
      setTeamData(allTeamData);
      // Reset redirect flag when no category is selected
      hasRedirectedRef.current = false;
    } else {
      const normalizedParam = normalizeCategory(categoryParam);
      const filtered = allTeamData.filter((member: any) => {
        const categories = member.category || [];
        
        return categories.some((cat: string) => {
          const normalizedCategory = normalizeCategory(cat || 'Uncategorized');
          return normalizedCategory === normalizedParam;
        });
      });
      setTeamData(filtered);
      
      // Redirect to first team member's detail page if category is selected and we haven't redirected yet
      if (filtered.length > 0 && !hasRedirectedRef.current && !loading) {
        const firstMember = filtered[0];
        const memberId = firstMember.id;
        if (memberId) {
          hasRedirectedRef.current = true;
          router.push(`/team/${memberId}?category=${encodeURIComponent(categoryParam)}`);
        }
      }
    }
  }, [searchParams, allTeamData, loading, router]);


  if (loading) {
    return (
      <section className="py-8 md:py-16 px-4 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
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
      </section>
    );
  }


  const categoryParam = searchParams.get('category');
  const displayCategory = categoryParam ? formatCategoryLabel(categoryParam) : null;

  return (
    <section className="py-8 md:py-16 px-4 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Team Members Grid */}
        {teamData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {teamData.map((member: any) => (
              <TeamMemberCard key={member.id} member={member} category={categoryParam} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {!categoryParam || categoryParam === 'all'
                ? 'No team members available yet.'
                : `No team members found in category "${displayCategory}".`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;

