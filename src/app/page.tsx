import Hero from '@/components/Hero';
import About from '@/components/About';
import Banner from '@/components/Banner';
import Partners from '@/components/Partners';
import LatestPortfolio from '@/components/LatestPortfolio';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <Banner />
      <Partners />
      <LatestPortfolio />
      <Footer />
    </main>
  );
}
