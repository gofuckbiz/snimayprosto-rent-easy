import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthTest from "@/components/AuthTest";

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <div className="container mx-auto px-4 py-8">
        <AuthTest />
      </div>
      <Footer />
    </div>
  );
};

export default IndexPage;
