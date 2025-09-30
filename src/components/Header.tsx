import { Link, useLocation } from "react-router-dom";
import { Trophy, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: "/", label: "Today's Quiz" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/archive", label: "Archive" },
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
              ? "text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          } transition-colors ${mobile ? "block py-2 text-lg" : ""}`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Trophy className="h-6 w-6 text-secondary" />
          <span className="text-xl font-bold">NBA Daily Quiz</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        {/* Auth Button - Desktop */}
        <div className="hidden md:block">
          <Button variant="secondary" size="sm">
            Sign In
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4 mt-8">
              <NavLinks mobile />
              <Button variant="secondary" className="mt-4">
                Sign In
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
