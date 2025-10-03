import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trophy, Menu, LogOut, User, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface HeaderProps {
  hideOnMobile?: boolean;
}

const Header = ({ hideOnMobile = false }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    { path: "/carousel", label: "Playground" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/how-to-play", label: "How to Play" },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`${
            isActive(link.path)
              ? "text-foreground font-semibold"
              : "text-muted-foreground hover:text-foreground"
          } transition-colors text-xs ${mobile ? "block py-2 text-sm" : ""}`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md transition-transform duration-300 ${hideOnMobile ? 'md:translate-y-0 -translate-y-full' : 'translate-y-0'}`}>
      <div className="container flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Trophy className="h-5 w-5 text-orange" />
          <span className="text-sm font-bold text-foreground">NBA Quiz</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLinks />
        </nav>

        {/* Auth Button - Desktop */}
        <div className="hidden md:block">
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
                    <p className="text-sm font-medium leading-none text-foreground">
                      {user.user_metadata?.display_name || user.email?.split('@')[0]}
                    </p>
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
              className="rounded-full h-9 px-5 font-semibold"
            >
              Sign in
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-card">
            <nav className="flex flex-col gap-4 mt-8">
              <NavLinks mobile />
              {user ? (
                <>
                  <Button variant="ghost" className="justify-start" onClick={() => navigate("/account")}>
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="mt-4 rounded-full h-10 px-6 font-semibold" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <Button 
                  variant="default" 
                  className="mt-4 rounded-full h-10 px-6 font-semibold" 
                  onClick={() => navigate("/auth")}
                >
                  Sign in
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
