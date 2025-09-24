import { Button } from "@/components/ui/button";
import { Car, Home, Phone } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Car className="h-6 w-6 text-primary" />
            <Home className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Charly Motors</h1>
            <p className="text-xs text-muted-foreground -mt-1">& Properties</p>
          </div>
        </div>
        
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
          <Button variant="professional" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </nav>

        <Button variant="outline" size="sm" className="md:hidden">
          Menu
        </Button>
      </div>
    </header>
  );
};

export default Header;