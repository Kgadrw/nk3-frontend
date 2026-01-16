'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  });
  const [contactInfo, setContactInfo] = useState({
    phoneNumbers: [] as string[],
    email: ''
  });
  const [teamCategories, setTeamCategories] = useState<string[]>([]);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const teamDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Hero section is 50vh on mobile (min 300px) or 70vh on desktop (min 500px)
      const isMobile = window.innerWidth < 768;
      const heroHeight = isMobile 
        ? Math.max(window.innerHeight * 0.5, 300)
        : Math.max(window.innerHeight * 0.7, 500);
      setIsPastHero(window.scrollY > heroHeight);
    };

    const handleCartUpdate = () => {
      const count = parseInt(localStorage.getItem('cartCount') || '0', 10);
      setCartCount(count);
    };

    const fetchSocialLinks = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const data = await cachedFetch<any>('/api/social');
        if (data) {
          setSocialLinks({
            facebook: data.facebook || '',
            twitter: data.twitter || '',
            linkedin: data.linkedin || '',
            instagram: data.instagram || ''
          });
        }
      } catch (error) {
        // Silently handle error
      }
    };

    const fetchContactInfo = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const data = await cachedFetch<any>('/api/contact');
        if (data && Object.keys(data).length > 0) {
          setContactInfo({
            phoneNumbers: data.phoneNumbers || [],
            email: data.email || ''
          });
        }
      } catch (error) {
        // Error fetching contact info
      }
    };

    const fetchTeamCategories = async () => {
      try {
        const { cachedFetch } = await import('@/lib/apiCache');
        const data = await cachedFetch<any[]>('/api/team');
        if (data && Array.isArray(data)) {
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

            // Check for founder variations (must check before generic contains check)
            if (categoryLower.includes('founder') && !categoryLower.includes('co-founder') && !categoryLower.includes('cofounder')) {
              return 'founder';
            }
            
            // Check for co-founder variations
            if (categoryLower.includes('co-founder') || categoryLower.includes('cofounder') || (categoryLower.includes('co') && categoryLower.includes('founder'))) {
              return 'co-founder';
            }

            // Check for technical variations
            if (categoryLower.includes('technical')) {
              return 'technical';
            }

            // Check for advisors variations
            if (categoryLower.includes('advisor') || categoryLower.includes('advisory')) {
              return 'advisors';
            }

            // Return normalized version (lowercase, replace spaces with hyphens)
            return categoryLower.replace(/\s+/g, '-');
          };

          // Helper function to format category name for display
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

            // Format other categories: capitalize first letter of each word
            return category
              .split(/[\s_-]+/)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
          };

          // Extract unique normalized categories from teams
          const normalizedCategoriesSet = new Set<string>();
          data.forEach((member: any) => {
            const categories = Array.isArray(member.category) 
              ? member.category 
              : (member.category ? [member.category] : ['Uncategorized']);
            categories.forEach((cat: string) => {
              if (cat && cat.trim()) {
                const normalized = normalizeCategory(cat.trim());
                normalizedCategoriesSet.add(normalized);
              }
            });
          });
          
          // Format category labels and use Set to ensure no duplicates
          const formattedCategoriesSet = new Set<string>();
          Array.from(normalizedCategoriesSet).forEach(cat => {
            const formatted = formatCategoryLabel(cat);
            formattedCategoriesSet.add(formatted);
          });
          
          // Add "All" and sort categories: "All" first, then alphabetical
          const allCategories = ['All', ...Array.from(formattedCategoriesSet)];
          const sortedCategories = allCategories.sort((a, b) => {
            if (a === 'All') return -1;
            if (b === 'All') return 1;
            return a.localeCompare(b);
          });
          
          setTeamCategories(sortedCategories);
        }
      } catch (error) {
        // Error fetching team categories
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Initial cart count
    handleCartUpdate();
    // Fetch social links
    fetchSocialLinks();
    // Fetch contact info
    fetchContactInfo();
    // Fetch team categories
    fetchTeamCategories();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);


  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
        setMobileMenuOpen(false);
      }
    };

    if (searchOpen || mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [searchOpen, mobileMenuOpen]);

  const allSearchItems = useMemo(() => [
    // Pages
    { type: 'page', title: 'Home', url: '/', keywords: 'home homepage main' },
    { type: 'page', title: 'Portfolio', url: '/portfolio', keywords: 'portfolio projects work designs' },
    { type: 'page', title: 'Shop', url: '/shop', keywords: 'shop store products buy purchase' },
    { type: 'page', title: 'Team', url: '/team', keywords: 'team members staff' },
    // Team Members
    { type: 'team', title: 'Maxime BAYINGANA RUTIMIRWA', url: '/team?category=founder', keywords: 'maxime bayingana rutimirwa co-founder founder' },
    { type: 'team', title: 'Erick NKURIKIYE', url: '/team?category=founder', keywords: 'erick nkurikiye managing director' },
    { type: 'team', title: 'Gabin KAYIHURA', url: '/team?category=founder', keywords: 'gabin kayihura co-founder founder' },
    // Products
    { type: 'product', title: 'Architectural Blueprints', url: '/shop', keywords: 'blueprints drawings technical' },
    { type: 'product', title: '3D Model Files', url: '/shop', keywords: '3d models files cad' },
    { type: 'product', title: 'Design Templates', url: '/shop', keywords: 'templates layouts designs' },
    { type: 'product', title: 'Technical Drawings', url: '/shop', keywords: 'drawings technical documents' },
    { type: 'product', title: 'CAD Files Collection', url: '/shop', keywords: 'cad files collection' },
    { type: 'product', title: 'Material Samples Kit', url: '/shop', keywords: 'materials samples kit' },
  ], []);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return [];
    }
    
    const query = searchQuery.toLowerCase().trim();
    return allSearchItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const keywordMatch = item.keywords.toLowerCase().includes(query);
      return titleMatch || keywordMatch;
    });
  }, [searchQuery, allSearchItems]);


  return (
    <header className="w-full">
      {/* Top Utility Bar - Dark Green */}
      <div className={`bg-[#009f3b] text-white py-2 px-4 hidden md:block transition-all duration-300 ${
        isPastHero ? 'hidden' : ''
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          {/* Left: Get A Quote Button */}
          <Link href="/contact" className="bg-[#90EE90] text-[#009f3b] px-4 py-2 font-semibold uppercase hover:bg-[#7dd87d] transition-colors text-xs md:text-sm inline-block">
            GET A QUOTE
          </Link>

          {/* Right: Contact Info and Social Media */}
          <div className="flex items-center gap-4 md:gap-6 flex-wrap text-xs md:text-sm">
            {/* Contact Information */}
            <div className="flex items-center gap-2 md:gap-4">
              {contactInfo.phoneNumbers.slice(0, 2).map((phone, index) => (
                <div key={index} className="flex items-center gap-1 md:gap-2">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-xs md:text-sm">
                    {index === 0 ? 'PH: ' : ''}{phone}
                  </span>
                </div>
              ))}
              {contactInfo.phoneNumbers.length === 0 && (
                <>
              <div className="flex items-center gap-1 md:gap-2">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-xs md:text-sm">PH: +(250) 783 206 660</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-xs md:text-sm">+86 13259839600</span>
              </div>
                </>
              )}
              <div className="flex items-center gap-1 md:gap-2">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-xs md:text-sm hidden lg:inline">
                  Email: {contactInfo.email || 'Info@Nk3dstudio.Rw'}
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-xs md:text-sm hidden sm:inline">FOLLOW US:</span>
              <div className="flex items-center gap-1 md:gap-2">
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - White */}
      <div className={`bg-white border-b border-gray-200 transition-all duration-300 overflow-visible ${
        isPastHero ? 'fixed top-0 left-0 right-0 z-[100]' : isScrolled ? 'sticky top-0 z-[100]' : 'relative z-[100]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 transition-all duration-300 flex items-center">
          <div className="flex items-center justify-between gap-4 w-full">
            {/* Left: Logo */}
            <div className="flex items-center gap-4 overflow-hidden">
              {/* Logo */}
              <div className="relative flex-shrink-0 transition-all duration-300">
                <Link href="/">
                  <div className={`relative transition-all duration-300 ${
                    isPastHero ? 'w-16 h-16' : isScrolled ? 'w-16 h-16' : 'w-32 h-32'
                  }`}>
                    <Image
                      src="/logo.png"
                      alt="NK 3D Architecture Studio Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>
              </div>
            </div>

            {/* Center: Navigation Links */}
            <nav className={`hidden md:flex items-center gap-4 transition-all duration-300 relative z-[101] ${
              isPastHero ? 'hidden' : ''
            }`}>
              <Link 
                href="/" 
                className={`relative text-[#009f3b] font-medium transition-all duration-300 py-1 group ${
                  pathname === '/' ? 'text-[#009f3b] font-semibold' : ''
                }`}
              >
                Home
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#009f3b] transition-all duration-300 ${
                  pathname === '/' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
              <Link 
                href="/about" 
                className={`relative text-[#009f3b] font-medium transition-all duration-300 py-1 group ${
                  pathname === '/about' ? 'text-[#009f3b] font-semibold' : ''
                }`}
              >
                About Us
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#009f3b] transition-all duration-300 ${
                  pathname === '/about' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
              <Link 
                href="/portfolio" 
                className={`relative text-[#009f3b] font-medium transition-all duration-300 py-1 group ${
                  pathname === '/portfolio' ? 'text-[#009f3b] font-semibold' : ''
                }`}
              >
                Portfolio
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#009f3b] transition-all duration-300 ${
                  pathname === '/portfolio' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
              
              {/* Team Link with Dropdown */}
              <div 
                className="relative z-[110]"
                onMouseEnter={() => {
                  if (teamDropdownTimeoutRef.current) {
                    clearTimeout(teamDropdownTimeoutRef.current);
                  }
                  setTeamDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  teamDropdownTimeoutRef.current = setTimeout(() => {
                    setTeamDropdownOpen(false);
                  }, 200);
                }}
              >
              <Link 
                href="/team" 
                className={`relative text-[#009f3b] font-medium transition-all duration-300 py-1 group ${
                  pathname?.startsWith('/team') ? 'text-[#009f3b] font-semibold' : ''
                }`}
                  onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
              >
                Team
                  <svg 
                    className={`w-4 h-4 inline-block ml-1 transition-transform duration-300 ${
                      teamDropdownOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#009f3b] transition-all duration-300 ${
                  pathname?.startsWith('/team') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
                
                {/* Dropdown Menu */}
                {teamDropdownOpen && teamCategories.length > 0 && (() => {
                  const currentCategory = searchParams.get('category');
                  
                  return (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-[110] py-2">
                      {teamCategories.map((category, index) => {
                        const categoryLower = category.toLowerCase();
                        const categoryMap: { [key: string]: string } = {
                          'all': 'all',
                          'company founder': 'founder',
                          'co-founder': 'co-founder',
                          'technical team': 'technical',
                          'advisory board': 'advisors',
                          'uncategorized': 'uncategorized',
                        };
                        const categoryParam = categoryMap[categoryLower] || categoryLower.replace(/\s+/g, '-');
                        const href = category === 'All' ? '/team' : `/team?category=${encodeURIComponent(categoryParam)}`;
                        const isActive = (category === 'All' && (!currentCategory || currentCategory === 'all')) ||
                                        (category !== 'All' && currentCategory === categoryParam);
                        
                        return (
                          <Link
                            key={index}
                            href={href}
                            onClick={() => setTeamDropdownOpen(false)}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? 'bg-[#009f3b] text-white font-semibold'
                                : 'text-gray-700 hover:bg-[#009f3b] hover:text-white'
                            }`}
                          >
                            {category}
                          </Link>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              <Link 
                href="/academy" 
                className={`relative text-[#009f3b] font-medium transition-all duration-300 py-1 group ${
                  pathname === '/academy' ? 'text-[#009f3b] font-semibold' : ''
                }`}
              >
                NK - 3D Academy
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#009f3b] transition-all duration-300 ${
                  pathname === '/academy' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
              <Link 
                href="/shop" 
                className={`relative text-[#009f3b] font-medium transition-all duration-300 py-1 group ${
                  pathname === '/shop' ? 'text-[#009f3b] font-semibold' : ''
                }`}
              >
                Shop
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#009f3b] transition-all duration-300 ${
                  pathname === '/shop' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
              <Link 
                href="/contact" 
                className={`relative text-[#009f3b] font-medium transition-all duration-300 py-1 group ${
                  pathname === '/contact' ? 'text-[#009f3b] font-semibold' : ''
                }`}
              >
                Contact Us
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#009f3b] transition-all duration-300 ${
                  pathname === '/contact' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            </nav>

            {/* Right: Action Icons */}
            <div className="flex items-center gap-3 transition-all duration-300">
              {/* Shopping Cart and Search - Always visible when scrolled */}
              <div className="flex items-center gap-3 transition-all duration-300">
                {/* Shopping Cart */}
                <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded transition-colors">
                  <svg className="w-6 h-6 text-[#009f3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-[#90EE90] text-[#009f3b] rounded-full flex items-center justify-center text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Search Button */}
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="w-10 h-10 bg-[#90EE90] flex items-center justify-center hover:bg-[#7dd87d] transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5 text-[#009f3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Button - Always visible on mobile */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 bg-[#009f3b] flex items-center justify-center hover:bg-[#00782d] transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Slide from Right */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              ></div>
              {/* Menu Drawer */}
              <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}>
                <nav className="px-4 py-6 space-y-2 h-full overflow-y-auto">
                  {/* Close Button */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-10 h-10 bg-[#009f3b] flex items-center justify-center hover:bg-[#00782d] transition-colors"
                      aria-label="Close Menu"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-[#009f3b] font-medium transition-colors ${
                    pathname === '/' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-[#009f3b] font-medium transition-colors ${
                    pathname === '/about' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  About Us
                </Link>
                <Link 
                  href="/portfolio" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-[#009f3b] font-medium transition-colors ${
                    pathname === '/portfolio' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  Portfolio
                </Link>
                
                {/* Team Mobile with Categories */}
                <div>
                {(() => {
                  const currentCategory = searchParams.get('category');
                  
                  return (
                    <>
                      <Link
                        href="/team"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-2 text-[#009f3b] font-medium transition-colors ${
                            pathname === '/team' && (!currentCategory || currentCategory === 'all') ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                        }`}
                      >
                        Team
                      </Link>
                      {teamCategories.length > 0 && (
                        <div className="pl-6 space-y-1">
                          {teamCategories.map((category, index) => {
                            const categoryLower = category.toLowerCase();
                            const categoryMap: { [key: string]: string } = {
                              'all': 'all',
                              'company founder': 'founder',
                              'co-founder': 'co-founder',
                              'technical team': 'technical',
                              'advisory board': 'advisors',
                              'uncategorized': 'uncategorized',
                            };
                            const categoryParam = categoryMap[categoryLower] || categoryLower.replace(/\s+/g, '-');
                            const href = category === 'All' ? '/team' : `/team?category=${encodeURIComponent(categoryParam)}`;
                            const isActive = (category === 'All' && (!currentCategory || currentCategory === 'all')) ||
                                            (category !== 'All' && currentCategory === categoryParam);
                            
                            return (
                              <Link
                                key={index}
                                href={href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                  isActive
                                    ? 'bg-[#009f3b] text-white font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {category}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}
                </div>

                <Link 
                  href="/academy" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-[#009f3b] font-medium transition-colors ${
                    pathname === '/academy' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  NK - 3D Academy
                </Link>
                <Link 
                  href="/shop" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-[#009f3b] font-medium transition-colors ${
                    pathname === '/shop' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  Shop
                </Link>
                <Link 
                  href="#" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-[#009f3b] font-medium hover:bg-gray-50 transition-colors"
                >
                  Contact Us
                </Link>
              </nav>
            </div>
            </>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-md bg-white/10 z-[100] flex items-start justify-center pt-16 md:pt-20 px-4"
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery('');
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] md:max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for pages, team members, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    window.location.href = searchResults[0].url;
                    setSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-base"
                autoComplete="off"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Results */}
            {searchQuery.length > 0 && (
              <div className="max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result, index) => (
                      <Link
                        key={index}
                        href={result.url}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#90EE90] flex items-center justify-center flex-shrink-0">
                          {result.type === 'page' ? (
                            <svg className="w-5 h-5 text-[#009f3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          ) : result.type === 'team' ? (
                            <svg className="w-5 h-5 text-[#009f3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-[#009f3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-700">{result.title}</p>
                          <p className="text-sm text-gray-500 capitalize">{result.type}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-gray-500">No results found</p>
                    <p className="text-sm text-gray-400 mt-1">Try searching for something else</p>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {searchQuery.length === 0 && (
              <div className="py-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500">Start typing to search</p>
                <p className="text-sm text-gray-400 mt-1">Search for pages, team members, and more</p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

