import HeroSection from '@/components/home/hero-section';
import FeaturesSection from '@/components/home/features-section';
import CategoriesSection from '@/components/home/categories-section';
import ProductDealsSection from '@/components/home/product-deals-section';
import TrustedBrandsSection from '@/components/home/trusted-brands-section';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      <ProductDealsSection />
      <TrustedBrandsSection />
      <CategoriesSection />
      <FeaturesSection />
    </main>
  );
}
