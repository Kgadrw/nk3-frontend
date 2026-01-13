'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// Team Member Card Component
const TeamMemberCard = ({ member, category }: { member: { id: number | string; name: string; role: string; image: string; phone?: string; email?: string; description?: string }; category?: string | null }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col bg-[#009f3b]">
      {/* Member Portrait */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
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

      {/* Member Info - Green Background */}
      <div className="bg-[#009f3b] p-4 md:p-6 flex flex-col flex-grow">
        {/* Name */}
        <h3 className="text-white text-lg md:text-xl font-bold mb-2">
          {member.name}
        </h3>
        
        {/* Role/Position */}
        <p className="text-[#90EE90] text-sm md:text-base mb-4">
          {member.role}
        </p>
        
        {/* More Button - Only show if description exists */}
        {member.description && member.description.trim() && (
          <Link 
            href={`/team/${member.id}${category ? `?category=${category}` : ''}`}
            className="mt-auto bg-[#00782d] hover:bg-[#005a1f] text-white px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors inline-block text-center"
          >
            More
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
      'uncategorized': 'uncategorized',
    };

    // Check exact match first
    if (normalizedMap[categoryLower]) {
      return normalizedMap[categoryLower];
    }

    // Check if category contains any of the keys
    for (const [key, value] of Object.entries(normalizedMap)) {
      if (categoryLower.includes(key) || key.includes(categoryLower)) {
        return value;
      }
    }

    // Return normalized version (lowercase, replace spaces with hyphens)
    return categoryLower.replace(/\s+/g, '-');
  };

  // Helper function to format category name
  const formatCategoryLabel = (category: string): string => {
    const categoryLower = category.toLowerCase();
    const labelMap: { [key: string]: string } = {
      'founder': 'Company Founder',
      'co-founder': 'Co-Founder',
      'cofounder': 'Co-Founder',
      'technical': 'Technical Team',
      'advisors': 'Company Advisors',
      'company-advisors': 'Company Advisors',
      'company advisors': 'Company Advisors',
      'advisory': 'Company Advisors',
      'advisory-board': 'Company Advisors',
      'advisory board': 'Company Advisors',
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
      'company-advisors': 4,
      'company advisors': 4,
      'advisory': 4,
      'advisory-board': 4,
      'advisory board': 4,
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
            // Normalize category to canonical form to prevent duplicates
            const normalizedCategory = normalizeCategory(cat || 'Uncategorized');
            if (!grouped[normalizedCategory]) {
              grouped[normalizedCategory] = [];
            }
            // Only add if not already in this category (avoid duplicates)
            if (!grouped[normalizedCategory].some((m: any) => m.id === member.id)) {
              grouped[normalizedCategory].push(member);
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
    
    // Normalize the selected category from URL
    const normalizedSelected = selectedCategory.toLowerCase().trim().replace(/\s+/g, '-');
    
    // Map URL parameters to actual category keys in groupedTeams
    const categoryMapping: { [key: string]: string[] } = {
      'founder': ['founder'],
      'co-founder': ['co-founder', 'cofounder'],
      'cofounder': ['co-founder', 'cofounder'],
      'technical': ['technical', 'technical-team', 'technical team'],
      'technical-team': ['technical', 'technical-team', 'technical team'],
      'advisors': ['advisors', 'company-advisors', 'company advisors', 'advisory', 'advisory-board', 'advisory board'],
      'company-advisors': ['advisors', 'company-advisors', 'company advisors', 'advisory', 'advisory-board', 'advisory board'],
      'advisory': ['advisors', 'company-advisors', 'company advisors', 'advisory', 'advisory-board', 'advisory board'],
      'advisory-board': ['advisors', 'company-advisors', 'company advisors', 'advisory', 'advisory-board', 'advisory board'],
      'advisory board': ['advisors', 'company-advisors', 'company advisors', 'advisory', 'advisory-board', 'advisory board'],
      'uncategorized': ['uncategorized'],
    };
    
    // Get possible category matches
    const possibleMatches = categoryMapping[normalizedSelected] || [normalizedSelected];
    
    const filtered: any = {};
    Object.keys(groupedTeams).forEach(category => {
      const categoryLower = category.toLowerCase().trim();
      const categoryNormalized = categoryLower.replace(/\s+/g, '-');
      
      // Check if this category matches any of the possible matches
      const matches = possibleMatches.some(match => {
        const matchLower = match.toLowerCase().trim();
        const matchNormalized = matchLower.replace(/\s+/g, '-');
        
        // Exact match (normalized)
        if (categoryNormalized === matchNormalized) return true;
        
        // Check if category contains match or vice versa
        if (categoryNormalized.includes(matchNormalized) || matchNormalized.includes(categoryNormalized)) {
          return true;
        }
        
        // Also check original formats
        if (categoryLower === matchLower) return true;
        if (categoryLower.includes(matchLower) || matchLower.includes(categoryLower)) {
          return true;
        }
        
        return false;
      });
      
      if (matches) {
        filtered[category] = groupedTeams[category];
      }
    });
    
    return filtered;
  };

  const filteredTeams = getFilteredCategories();

  // Get all available categories
  const allCategories = Object.keys(groupedTeams).sort((a, b) => {
    return getCategoryOrder(a) - getCategoryOrder(b);
  });

  // Get the active category from URL or default to showing all
  const activeCategory = selectedCategory 
    ? allCategories.find(cat => {
        const normalizedSelected = selectedCategory.toLowerCase().replace(/\s+/g, '-');
        const categoryLower = cat.toLowerCase();
        return categoryLower === normalizedSelected || categoryLower.includes(normalizedSelected);
      })
    : null;

  return (
    <section className="py-8 md:py-16 px-4 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto z-10">
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200 bg-[#009f3b]">
                  <h2 className="text-lg font-bold text-white">Categories</h2>
                </div>
                <nav className="p-2">
                  <Link
                    href="/team"
                    className={`block px-4 py-3 text-sm font-medium rounded transition-colors mb-1 ${
                      !selectedCategory
                        ? 'bg-[#009f3b] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Team Members
                    <span className={`ml-2 text-xs font-semibold ${
                      !selectedCategory ? 'text-white' : 'text-[#009f3b]'
                    }`}>
                      ({teamData.length})
                    </span>
                  </Link>
                  {allCategories.map((category) => {
                    const categoryLower = category.toLowerCase().trim();
                    
                    // Create URL-friendly category parameter
                    // Use the actual category key for the URL
                    const categoryParam = categoryLower.replace(/\s+/g, '-');
                    
                    // Check if this category is active
                    const isActive = selectedCategory 
                      ? (() => {
                          const selectedLower = selectedCategory.toLowerCase().trim();
                          const selectedNormalized = selectedLower.replace(/\s+/g, '-');
                          const categoryNormalized = categoryLower.replace(/\s+/g, '-');
                          
                          // Direct match (normalized)
                          if (categoryNormalized === selectedNormalized) return true;
                          if (categoryLower === selectedLower) return true;
                          
                          // Check if category contains selected or vice versa
                          if (categoryNormalized.includes(selectedNormalized) || selectedNormalized.includes(categoryNormalized)) {
                            return true;
                          }
                          if (categoryLower.includes(selectedLower) || selectedLower.includes(categoryLower)) {
                            return true;
                          }
                          
                          // Additional check for common mappings
                          const mappings: { [key: string]: string[] } = {
                            'founder': ['founder'],
                            'co-founder': ['co-founder', 'cofounder'],
                            'cofounder': ['co-founder', 'cofounder'],
                            'technical': ['technical', 'technical-team', 'technical team'],
                            'technical-team': ['technical', 'technical-team', 'technical team'],
                            'advisors': ['advisors', 'company-advisors', 'company advisors', 'advisory', 'advisory-board', 'advisory board'],
                            'company-advisors': ['advisors', 'company-advisors', 'company advisors', 'advisory', 'advisory-board', 'advisory board'],
                            'advisory': ['advisors', 'company-advisors', 'company advisors', 'advisory', 'advisory-board', 'advisory board'],
                            'advisory-board': ['advisors', 'company-advisors', 'company advisors', 'advisory', 'advisory-board', 'advisory board'],
                            'advisory board': ['advisors', 'company-advisors', 'company advisors', 'advisory', 'advisory-board', 'advisory board'],
                            'uncategorized': ['uncategorized'],
                          };
                          const selectedMatches = mappings[selectedNormalized] || mappings[selectedLower] || [selectedLower, selectedNormalized];
                          return selectedMatches.some(m => {
                            const mLower = m.toLowerCase().trim();
                            const mNormalized = mLower.replace(/\s+/g, '-');
                            return categoryLower === mLower || 
                                   categoryNormalized === mNormalized ||
                                   categoryLower.includes(mLower) || 
                                   mLower.includes(categoryLower) ||
                                   categoryNormalized.includes(mNormalized) ||
                                   mNormalized.includes(categoryNormalized);
                          });
                        })()
                      : false;
                    
                    return (
                      <Link
                        key={category}
                        href={`/team?category=${encodeURIComponent(categoryParam)}`}
                        className={`block px-4 py-3 text-sm font-medium rounded transition-colors mb-1 ${
                          isActive
                            ? 'bg-[#009f3b] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {formatCategoryLabel(category)}
                        <span className={`ml-2 text-xs font-semibold ${
                          isActive ? 'text-white' : 'text-[#009f3b]'
                        }`}>
                          ({groupedTeams[category]?.length || 0})
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content - Team Members */}
          <div className="flex-1">
            {/* Show filter info if category is selected */}
            {selectedCategory && (
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#009f3b] mb-2">
                  {formatCategoryLabel(selectedCategory)}
                </h2>
                <p className="text-gray-600">
                  Showing {Object.values(filteredTeams).flat().length} team member(s)
                </p>
              </div>
            )}

            {/* Display team members */}
            {Object.keys(filteredTeams).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(filteredTeams).map(([category, members]: [string, any]) => (
              <div key={category} className="space-y-6">
                    {/* Category Header - Only show if not filtering by category */}
                    {!selectedCategory && (
                <div className="pb-2">
                  <h3 className="text-xl md:text-2xl font-bold text-[#009f3b]">
                    {formatCategoryLabel(category)}
                  </h3>
                </div>
                    )}

                    {/* Team Members Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
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
        </div>
      </div>
    </section>
  );
};

export default Team;

