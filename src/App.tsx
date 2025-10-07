import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Game from "./pages/Game";
import CarouselMenu from "./pages/CarouselMenu";
import CarouselSingle from "./pages/CarouselSingle";
import CarouselPlayer from "./pages/CarouselPlayer";
import Leaderboard from "./pages/Leaderboard";
import HowToPlay from "./pages/HowToPlay";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import Results from "./pages/Results";
import AlreadyCompleted from "./pages/AlreadyCompleted";
import Training from "./pages/Training";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
          <Route path="/carousel/player" element={<CarouselPlayer />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/already-completed" element={<AlreadyCompleted />} />
          <Route path="/training" element={<Training />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/account" element={<Account />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
