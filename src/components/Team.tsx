'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Team Member Card Component
const TeamMemberCard = ({ member, category }: { member: { id: number | string; name: string; role: string; image: string; phone?: string; email?: string; description?: string }; category?: string | null }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Member Portrait */}
      <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden bg-white">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-4xl font-bold">
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
      </div>

      {/* Member Info */}
      <div className="w-full space-y-1">
        {/* Role */}
        <p className="text-sm font-medium text-[#009f3b] uppercase">
          {member.role}
        </p>
        
        {/* Name */}
        <h3 className="text-base font-semibold text-gray-900">
          {member.name}
        </h3>
        
        {/* Bio Link - Only show if description exists */}
        {member.description && member.description.trim() && (
          <Link 
            href={`/team/${member.id}${category ? `?category=${category}` : ''}`}
            className="inline-block text-sm font-medium text-[#009f3b] hover:text-[#00782d] transition-colors mt-2"
          >
            Bio
          </Link>
        )}
      </div>
    </div>
  );
};

const Team = () => {
  const [teamData, setTeamData] = useState<any[]>([]);
  const [groupedTeams, setGroupedTeams] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Helper function to format category name
  const formatCategoryLabel = (category: string): string => {
    const categoryLower = category.toLowerCase();
    const labelMap: { [key: string]: string } = {
      'founder': 'Company Founder',
      'co-founder': 'Co-Founder',
      'cofounder': 'Co-Founder',
      'technical': 'Technical Team',
      'advisors': 'Company Advisors',
      'uncategorized': 'Uncategorized',
    };

    if (labelMap[categoryLower]) {
      return labelMap[categoryLower];
    }

    // Format other categories: capitalize first letter of each word
    return category
      .split(/[\s_-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Define hierarchical order for categories
  const getCategoryOrder = (category: string): number => {
    const categoryLower = category.toLowerCase();
    const orderMap: { [key: string]: number } = {
      'founder': 1,
      'co-founder': 2,
      'cofounder': 2,
      'technical': 3,
      'advisors': 4,
      'uncategorized': 999,
    };
    return orderMap[categoryLower] || 5;
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        
        // Process team members
        const processedMembers = (data || []).map((member: any) => ({
          ...member,
          id: member._id || member.id,
          role: member.position,
          email: member.linkedin
        }));

        // Group by category
        const grouped: any = {};
        processedMembers.forEach((member: any) => {
          const category = (member.category || 'Uncategorized').toLowerCase();
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(member);
        });

        // Sort categories by hierarchy
        const sortedCategories = Object.keys(grouped).sort((a, b) => {
          return getCategoryOrder(a) - getCategoryOrder(b);
        });

        // Create ordered grouped object
        const orderedGrouped: any = {};
        sortedCategories.forEach(category => {
          orderedGrouped[category] = grouped[category];
        });

        setGroupedTeams(orderedGrouped);
        setTeamData(processedMembers);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

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

  return (
    <section className="py-8 md:py-16 px-4 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Display all team members hierarchically */}
        {Object.keys(groupedTeams).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedTeams).map(([category, members]: [string, any]) => (
              <div key={category} className="space-y-6">
                {/* Category Header */}
                <div className="pb-2">
                  <h3 className="text-xl md:text-2xl font-bold text-[#009f3b]">
                    {formatCategoryLabel(category)}
                  </h3>
                </div>

                {/* Team Members Grid for this category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {members.map((member: any) => (
                    <TeamMemberCard key={member.id} member={member} category={category} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No team members available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;

