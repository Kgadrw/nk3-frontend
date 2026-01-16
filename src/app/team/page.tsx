'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

function TeamRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const redirectToFirstMember = async () => {
      try {
        const category = searchParams.get('category');
        const { cachedFetch } = await import('@/lib/apiCache');
        const allMembers = await cachedFetch<any[]>('/api/team');
        
        if (!allMembers || allMembers.length === 0) {
          return;
        }

        // Helper function to normalize category
        const normalizeCategory = (cat: string): string => {
          const categoryLower = cat.toLowerCase().trim();
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
          return normalizedMap[categoryLower] || categoryLower.replace(/\s+/g, '-');
        };

        let targetMember = null;

        if (category && category !== 'all') {
          // Filter by category
          const normalizedParam = normalizeCategory(category);
          const filtered = allMembers.filter((member: any) => {
            const categories = Array.isArray(member.category) 
              ? member.category 
              : (member.category ? [member.category] : []);
            
            return categories.some((cat: string) => {
              const normalizedCategory = normalizeCategory(cat || 'Uncategorized');
              return normalizedCategory === normalizedParam;
            });
          });
          
          if (filtered.length > 0) {
            targetMember = filtered[0];
          }
        } else {
          // No category or 'all', use first member
          targetMember = allMembers[0];
        }

        if (targetMember) {
          const memberId = targetMember._id || targetMember.id;
          if (memberId) {
            const categoryParam = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
            router.replace(`/team/${memberId}${categoryParam}`);
          }
        }
      } catch (error) {
        console.error('Error redirecting to team member:', error);
      }
    };

    redirectToFirstMember();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009f3b]"></div>
        <p className="mt-4 text-gray-600">Loading team member...</p>
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009f3b]"></div>
            <p className="mt-4 text-gray-600">Loading team members...</p>
          </div>
        </div>
      }>
        <TeamRedirect />
      </Suspense>
      <Footer />
    </>
  );
}

