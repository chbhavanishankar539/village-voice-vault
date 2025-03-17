
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageSquare, Home, BarChart2, Plus } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "backdrop-blur-md border-b",
        scrolled 
          ? "bg-white/80 dark:bg-black/50 border-border/50" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-lg font-medium">Village Feedback Hub</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive('/') ? "secondary" : "ghost"} 
                size="sm" 
                className="flex items-center gap-1.5"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button 
                variant={isActive('/dashboard') ? "secondary" : "ghost"} 
                size="sm" 
                className="flex items-center gap-1.5"
              >
                <BarChart2 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/submit" className="hidden sm:inline-flex">
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Submit Feedback</span>
            </Button>
          </Link>
          <Link to="/submit" className="sm:hidden">
            <Button 
              variant="default" 
              size="icon" 
              className="h-9 w-9"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
