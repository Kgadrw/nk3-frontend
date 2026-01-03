'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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

type TeamCategory = string | null;

const Team = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState<TeamCategory>(categoryParam || null);
  const [teamData, setTeamData] = useState<any>({});
  const [categories, setCategories] = useState<Array<{ id: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format category name
  const formatCategoryLabel = (category: string): string => {
    // Handle common cases
    const categoryLower = category.toLowerCase();
    const labelMap: { [key: string]: string } = {
      'founder': 'Company Founder',
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

  useEffect(() => {
    setActiveCategory(categoryParam || null);
  }, [categoryParam]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        // Group by category
        const grouped: any = {};
        (data || []).forEach((member: any) => {
          const category = (member.category || 'Uncategorized').toLowerCase();
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push({
            ...member,
            id: member._id || member.id,
            role: member.position,
            email: member.linkedin // Using linkedin as email placeholder, adjust if needed
          });
        });
        setTeamData(grouped);

        // Generate categories dynamically from backend data
        const uniqueCategories = Object.keys(grouped).sort();
        const dynamicCategories = uniqueCategories.map(cat => ({
          id: cat,
          label: formatCategoryLabel(cat)
        }));
        setCategories(dynamicCategories);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // Map activeCategory to the data key (handle case differences)
  const getCurrentTeam = () => {
    if (!activeCategory) return [];
    const categoryKey = activeCategory.toLowerCase();
    return teamData[categoryKey] || [];
  };

  const currentTeam = getCurrentTeam();

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
        {/* Section Header */}
        <div className="text-left mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#009f3b] mb-2">
            OUR TEAM
          </h2>
          <p className="text-gray-600 text-xs md:text-sm">
            Meet the talented individuals behind NK-3D Architecture Studio
          </p>
        </div>

        {/* Category Selection - Show when no category is selected */}
        {!activeCategory && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-xl text-gray-700 mb-8 font-semibold">
              Please select a team category from the navigation menu
            </p>
          </div>
        )}

        {/* Category Selected - Show team members */}
        {activeCategory && (
          <>
            {/* Category Toggle Buttons */}
            <div className="mb-6">
              <div className="flex flex-wrap justify-start gap-2">
                {categories.map((category) => {
                  const isActive = activeCategory?.toLowerCase() === category.id.toLowerCase();
                  return (
                    <Link
                      key={category.id}
                      href={`/team?category=${category.id}`}
                      className={`px-4 py-2 text-sm font-semibold uppercase transition-all duration-300 ${
                        isActive
                          ? 'bg-[#009f3b] text-white'
                          : 'bg-gray-200 text-[#009f3b] hover:bg-gray-300'
                      }`}
                    >
                      {category.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {currentTeam.map((member: any) => (
                <TeamMemberCard key={member.id} member={member} category={activeCategory} />
              ))}
            </div>

            {/* Empty State */}
            {currentTeam.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No team members available in this category yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Team;

