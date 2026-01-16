import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';

// Lazy load below-the-fold components for better performance
const Banner = dynamic(() => import('@/components/Banner'), {
  loading: () => <div className="min-h-[300px] md:min-h-[350px]" />,
});

const Partners = dynamic(() => import('@/components/Partners'), {
  loading: () => <div className="min-h-[200px]" />,
});

const LatestPortfolio = dynamic(() => import('@/components/LatestPortfolio'), {
  loading: () => <div className="min-h-[400px]" />,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="min-h-[300px]" />,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <Banner />
      <Services />
      <LatestPortfolio />
      <Partners />
      <Footer />
    </main>
  );
}
