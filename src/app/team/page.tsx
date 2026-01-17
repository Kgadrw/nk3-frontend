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

        // If no category provided, redirect to first available category
        if (!category || category === 'all') {
          const allCategories = new Set<string>();
          allMembers.forEach((member: any) => {
            const categories = Array.isArray(member.category) 
              ? member.category 
              : (member.category ? [member.category] : ['Uncategorized']);
            categories.forEach((cat: string) => {
              if (cat && cat.trim()) {
                allCategories.add(normalizeCategory(cat.trim()));
              }
            });
          });

          if (allCategories.size > 0) {
            // Get first category and redirect to it
            const firstCategory = Array.from(allCategories).sort()[0];
            const filtered = allMembers.filter((member: any) => {
              const categories = Array.isArray(member.category) 
                ? member.category 
                : (member.category ? [member.category] : []);
              
              return categories.some((cat: string) => {
                const normalizedCategory = normalizeCategory(cat || 'Uncategorized');
                return normalizedCategory === firstCategory;
              });
            });
            
            if (filtered.length > 0) {
              const targetMember = filtered[0];
              const memberId = targetMember._id || targetMember.id;
              if (memberId) {
                router.replace(`/team/${memberId}?category=${encodeURIComponent(firstCategory)}`);
                return;
              }
            }
          }
          // If no categories found, stay on page (will show loading)
          return;
        }

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
          const targetMember = filtered[0];
          const memberId = targetMember._id || targetMember.id;
          if (memberId) {
            router.replace(`/team/${memberId}?category=${encodeURIComponent(category)}`);
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

