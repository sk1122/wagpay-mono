import CTA from '@/components/DeveloperPage/CTA';
import Hero from '@/components/DeveloperPage/HeroSec';
import Solustions from '@/components/DeveloperPage/Solutions';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const DevPage = () => {
  return (
    <>
      <div className="bg-wagpay-dark">
        <Navbar />
        <Hero />
        <CTA />
        <Solustions />
        <Footer />
      </div>
    </>
  );
};

export default DevPage;
