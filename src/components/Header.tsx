import { Button } from "@/components/ui/button";
import { Car, Home, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Car className="h-6 w-6 text-primary" />
            <Home className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Charly Motors</h1>
            <p className="text-xs text-muted-foreground -mt-1">& Properties</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#hero" className="text-sm font-medium transition-smooth hover:text-primary">
            Home
          </a>
          <a href="#cars" className="text-sm font-medium transition-smooth hover:text-primary">
            Cars
          </a>
          <a href="#properties" className="text-sm font-medium transition-smooth hover:text-primary">
            Properties
          </a>
          <a href="#about" className="text-sm font-medium transition-smooth hover:text-primary">
            About
          </a>
          <a href="#contact" className="text-sm font-medium transition-smooth hover:text-primary">
            Contact
          </a>
        </nav>

        {/* Auth & CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t bg-background">
            <a href="#hero" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary">Home</a>
            <a href="#cars" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary">Cars</a>
            <a href="#properties" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary">Properties</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary">About</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary">Contact</a>
            
            {user ? (
              <div className="space-y-2 pt-2 px-3">
                <div className="text-xs text-muted-foreground mb-2">
                  Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="block px-3 pt-2" onClick={() => setIsMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;