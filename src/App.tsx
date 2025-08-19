import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import IndexPage from "@/pages/Index";
import PropertiesPage from "@/pages/Properties";
import PropertyDetailPage from "@/pages/PropertyDetail";
import HowItWorksPage from "@/pages/HowItWorks";
import NotFoundPage from "@/pages/NotFound";
import MyListingsPage from "@/components/MyListingsPage";
import PricingPage from "@/pages/Pricing";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/listing/:id" element={<PropertyDetailPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
