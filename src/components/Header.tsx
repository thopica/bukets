import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, User, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HeaderProps {
  hideOnMobile?: boolean;
}

const Header = ({ hideOnMobile = false }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Scroll detection for glassmorphic header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    setIsAdmin(!!data);
  };

  const handleResetLeaderboard = async () => {
    setIsResetting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive",
        });
        return;
      }

      const response = await api.invoke('reset-leaderboard', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Success",
        description: "Leaderboard has been reset",
      });

      // Refresh the page if on leaderboard
      if (location.pathname === '/leaderboard') {
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset leaderboard",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
      setShowResetDialog(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/");
    }
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/game", label: "Today's Quiz" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/carousel/single", label: "Playground" },
    { path: "/how-to-play", label: "How to Play" },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
    return (
      <>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${
              isActive(link.path) 
                ? "text-foreground font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            } transition-colors text-base ${mobile ? "block py-3 text-xl touch-target" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </>
    );
  };

  return (
    <header className={`sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-all duration-300 ${hideOnMobile ? 'md:translate-y-0 -translate-y-full' : 'translate-y-0'} ${isScrolled ? 'shadow-md border-b border-border/50' : 'border-b border-transparent'}`}>
      <div className="container flex h-20 md:h-24 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="NBA Quiz Logo" className="h-8 w-14 md:h-16 md:w-24" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLinks />
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-orange hover:text-orange/80 hover:bg-orange/10"
              onClick={() => setShowResetDialog(true)}
              title="Reset Leaderboard (Admin Only)"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </nav>

        {/* Auth Button - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isAdmin && (
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange/20 text-orange border border-orange/30">
              ADMIN
            </span>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                    <AvatarFallback className="bg-orange/10 text-orange">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {user.user_metadata?.display_name || user.email?.split('@')[0]}
                      </p>
                      {isAdmin && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange/20 text-orange">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/auth")}
              className="rounded-full h-11 px-5 font-semibold touch-target bg-primary text-white hover:bg-primary/90"
            >
              Sign in
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg touch-target-sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-card px-6">
            <nav className="flex flex-col gap-5 mt-8">
              {isAdmin && (
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange/20 text-orange border border-orange/30">
                    ADMIN
                  </span>
                </div>
              )}
              <NavLinks mobile />
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  className="justify-start text-orange hover:text-orange hover:bg-orange/10 touch-target"
                  onClick={() => setShowResetDialog(true)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Leaderboard
                </Button>
              )}
              {user ? (
                <>
                  <Button variant="ghost" className="justify-start touch-target" onClick={() => navigate("/account")}>
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="mt-4 rounded-full h-11 px-6 font-semibold touch-target" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <Button 
                  variant="default" 
                  className="mt-4 rounded-full h-11 px-6 font-semibold touch-target" 
                  onClick={() => navigate("/auth")}
                >
                  Sign in
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Reset Leaderboard Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Leaderboard</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the entire leaderboard? This will delete all scores, streaks, and quiz sessions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetLeaderboard}
              disabled={isResetting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isResetting ? "Resetting..." : "Reset Leaderboard"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
