import { Suspense } from 'react';
import Team from '@/components/Team';
import Footer from '@/components/Footer';

export default function TeamPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Team />
      </Suspense>
      <Footer />
    </>
  );
}

