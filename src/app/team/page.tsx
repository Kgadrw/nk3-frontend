import { Suspense } from 'react';
import Team from '@/components/Team';
import Footer from '@/components/Footer';

function TeamContent() {
  return <Team />;
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
        <TeamContent />
      </Suspense>
      <Footer />
    </>
  );
}

