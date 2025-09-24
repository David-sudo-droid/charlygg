import { Button } from "@/components/ui/button";
import { Car, Home, Phone, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { user, profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
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
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#cars" className="text-sm font-medium transition-smooth hover:text-primary">
            Cars
          </a>
          <a href="#properties" className="text-sm font-medium transition-smooth hover:text-primary">
            Properties
          </a>
          <a href="#about" className="text-sm font-medium transition-smooth hover:text-primary">
            About
          </a>
          
          {user ? (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="accent" size="sm">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <span className="text-sm text-muted-foreground">
                {profile?.full_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Button variant="professional" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          )}
        </nav>

        <Button variant="outline" size="sm" className="md:hidden">
          Menu
        </Button>
      </div>
    </header>
  );
};

export default Header;