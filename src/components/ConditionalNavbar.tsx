'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

function NavbarContent() {
  return <Navbar />;
}

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return (
    <Suspense fallback={
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  );
}

