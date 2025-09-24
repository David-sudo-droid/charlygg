import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ListingsGrid from "@/components/ListingsGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ListingsGrid />
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Charly Motors & Properties</h3>
              <p className="text-sm opacity-90">
                Your trusted partner for quality vehicles and properties in Kenya.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#cars" className="hover:text-accent transition-smooth">Cars</a></li>
                <li><a href="#properties" className="hover:text-accent transition-smooth">Properties</a></li>
                <li><a href="#about" className="hover:text-accent transition-smooth">About Us</a></li>
                <li><a href="#contact" className="hover:text-accent transition-smooth">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact Info</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>📱 +254 712 345 678</li>
                <li>📧 info@charlymotors.co.ke</li>
                <li>📍 Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2024 Charly Motors & Properties. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
