'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Team Member Card Component
const TeamMemberCard = ({ member }: { member: { id: number; name: string; role: string; image: string; phone?: string; email?: string } }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Member Portrait with Blurred Green Background */}
      <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden group">
        {/* Blurred Green Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#009f3b] to-[#00782d] blur-sm scale-110 opacity-30 z-0"></div>
        
        {/* Member Image or Placeholder */}
        <div className="relative w-full h-full">
          {/* Fallback placeholder - shows behind image or when image errors */}
          <div className={`absolute inset-0 w-full h-full flex items-center justify-center bg-[#009f3b] ${imageError ? 'z-20' : 'z-10'}`}>
            <span className="text-white text-4xl font-bold">
              {member.name.charAt(0)}
            </span>
          </div>
          {/* Member Image */}
          {!imageError && (
            <div className="absolute inset-0 z-20">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-center"
                onError={() => setImageError(true)}
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
          )}
        </div>

        {/* Contact Icons - Top Right */}
        {(member.phone || member.email) && (
          <div className="absolute top-1 right-1 md:top-2 md:right-2 z-30 flex flex-col gap-1 md:gap-2">
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="bg-white/80 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-white transition-colors"
                title={member.phone}
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 text-[#009f3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="bg-white/80 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-white transition-colors"
                title={member.email}
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 text-[#009f3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Member Name and Role */}
      <div className="w-full">
        <h3 className="text-lg font-semibold text-[#009f3b] mb-1">
          {member.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {member.role}
        </p>
      </div>
    </div>
  );
};

type TeamCategory = 'founder' | 'technical' | 'advisors' | null;

const Team = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as TeamCategory;
  const [activeCategory, setActiveCategory] = useState<TeamCategory>(categoryParam || null);
  const [teamData, setTeamData] = useState<any>({});
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const categories = [
    { id: 'founder' as TeamCategory, label: 'Company Founder' },
    { id: 'technical' as TeamCategory, label: 'Technical Team' },
    { id: 'advisors' as TeamCategory, label: 'Company Advisors' },
    { id: 'uncategorized' as TeamCategory, label: 'Uncategorized' },
  ];

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
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/team?category=${category.id}`}
                    className={`px-4 py-2 text-sm font-semibold uppercase transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-[#009f3b] text-white'
                        : 'bg-gray-200 text-[#009f3b] hover:bg-gray-300'
                    }`}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {currentTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
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

