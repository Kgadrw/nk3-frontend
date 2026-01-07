'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const selectedCategory = searchParams?.get('category');
  const [teamData, setTeamData] = useState<any[]>([]);
  const [groupedTeams, setGroupedTeams] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

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

        // Group by category - handle both array and string categories
        const grouped: any = {};
        processedMembers.forEach((member: any) => {
          const categories = Array.isArray(member.category) 
            ? member.category 
            : (member.category ? [member.category] : ['Uncategorized']);
          
          categories.forEach((cat: string) => {
            const category = (cat || 'Uncategorized').toLowerCase();
            if (!grouped[category]) {
              grouped[category] = [];
            }
            // Only add if not already in this category (avoid duplicates)
            if (!grouped[category].some((m: any) => m.id === member.id)) {
              grouped[category].push(member);
            }
          });
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
        
        // Initialize expanded state - expand first category by default, or selected category if filtering
        const categories = Object.keys(orderedGrouped);
        const initialExpanded: { [key: string]: boolean } = {};
        if (selectedCategory) {
          // If filtering, expand only the selected category
          const normalizedSelected = selectedCategory.toLowerCase().replace(/\s+/g, '-');
          categories.forEach(cat => {
            const categoryLower = cat.toLowerCase();
            if (categoryLower === normalizedSelected || categoryLower.includes(normalizedSelected)) {
              initialExpanded[cat] = true;
            } else {
              initialExpanded[cat] = false;
            }
          });
        } else {
          // If not filtering, expand first category by default
          categories.forEach((cat, index) => {
            initialExpanded[cat] = index === 0;
          });
        }
        setExpandedCategories(initialExpanded);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [selectedCategory]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

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

  // Filter categories based on query parameter
  const getFilteredCategories = () => {
    if (!selectedCategory) {
      return groupedTeams;
    }
    
    // Normalize the selected category
    const normalizedSelected = selectedCategory.toLowerCase().replace(/\s+/g, '-');
    const categoryMap: { [key: string]: string[] } = {
      'founder': ['founder'],
      'co-founder': ['co-founder', 'cofounder'],
      'cofounder': ['co-founder', 'cofounder'],
      'technical': ['technical', 'technical-team'],
      'technical-team': ['technical', 'technical-team'],
      'advisors': ['advisors', 'company-advisors'],
      'company-advisors': ['advisors', 'company-advisors'],
      'uncategorized': ['uncategorized'],
    };
    
    const matchingCategories = categoryMap[normalizedSelected] || [normalizedSelected];
    
    const filtered: any = {};
    Object.keys(groupedTeams).forEach(category => {
      const categoryLower = category.toLowerCase();
      if (matchingCategories.some(match => categoryLower === match || categoryLower.includes(match))) {
        filtered[category] = groupedTeams[category];
      }
    });
    
    return filtered;
  };

  const filteredTeams = getFilteredCategories();

  return (
    <section className="py-8 md:py-16 px-4 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Show filter info if category is selected */}
        {selectedCategory && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-2">
                {formatCategoryLabel(selectedCategory)}
              </h2>
              <p className="text-gray-600">
                Showing {Object.values(filteredTeams).flat().length} team member(s)
              </p>
            </div>
            <Link
              href="/team"
              className="text-[#009f3b] hover:text-[#00782d] font-medium underline"
            >
              View All Team Members
            </Link>
          </div>
        )}

        {/* Display team members */}
        {Object.keys(filteredTeams).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(filteredTeams).map(([category, members]: [string, any]) => {
              const isExpanded = expandedCategories[category] !== false; // Default to true if not set
              
              return (
                <div key={category} className="border border-gray-200">
                  {/* Category Header with Toggle Button */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl md:text-2xl font-bold text-[#009f3b]">
                        {formatCategoryLabel(category)}
                      </h3>
                      <span className="text-sm text-gray-500 font-normal">
                        ({members.length} {members.length === 1 ? 'member' : 'members'})
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-[#009f3b] transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Team Members Grid - Collapsible */}
                  {isExpanded && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pt-4">
                        {members.map((member: any) => (
                          <TeamMemberCard key={member.id} member={member} category={category} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedCategory 
                ? `No team members found in category "${formatCategoryLabel(selectedCategory)}".`
                : 'No team members available yet.'}
            </p>
            {selectedCategory && (
              <Link
                href="/team"
                className="inline-block mt-4 text-[#009f3b] hover:text-[#00782d] font-medium underline"
              >
                View All Team Members
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;

