import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default IndexPage;
