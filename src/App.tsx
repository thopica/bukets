import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { supabase } from "@/integrations/supabase/client";
import CountrySelectionModal from "@/components/CountrySelectionModal";
import Index from "./pages/Index";
import Game from "./pages/Game";
import CarouselMenu from "./pages/CarouselMenu";
import CarouselSingle from "./pages/CarouselSingle";
import Leaderboard from "./pages/Leaderboard";
import HowToPlay from "./pages/HowToPlay";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import Results from "./pages/Results";
import AlreadyCompleted from "./pages/AlreadyCompleted";
import Training from "./pages/Training";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [isCheckingCountry, setIsCheckingCountry] = useState(true);

  useEffect(() => {
    const checkUserCountry = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user has a country set
          const { data: profile } = await supabase
            .from('profiles')
            .select('country_code')
            .eq('user_id', user.id)
            .single();

          if (profile && !profile.country_code) {
            setShowCountryModal(true);
          }
        }
      } catch (error) {
        console.error('Error checking user country:', error);
      } finally {
        setIsCheckingCountry(false);
      }
    };

    checkUserCountry();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkUserCountry();
      } else if (event === 'SIGNED_OUT') {
        setShowCountryModal(false);
        setIsCheckingCountry(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCountryModalComplete = () => {
    setShowCountryModal(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<Game />} />
            <Route path="/carousel" element={<CarouselMenu />} />
            <Route path="/carousel/single" element={<CarouselSingle />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/already-completed" element={<AlreadyCompleted />} />
            <Route path="/training" element={<Training />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
            <Route path="/account" element={<Account />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* Country Selection Modal */}
        {!isCheckingCountry && (
          <CountrySelectionModal 
            isOpen={showCountryModal} 
            onComplete={handleCountryModalComplete} 
          />
        )}
        <Analytics />
        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
