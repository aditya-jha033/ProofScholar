import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Key, Lock, Info, Menu } from 'lucide-react';
import WalletBanner from './WalletBanner';
import { Button } from '@/components/ui/button';

export default function NavBar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Verify', path: '/verify', icon: <Key className="h-4 w-4" /> },
    { name: 'Admin', path: '/admin', icon: <Lock className="h-4 w-4" /> },
    { name: 'About', path: '/about', icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="ProofScholar Logo" className="h-8 w-8 object-contain" />
          <span className="font-bold text-xl hidden sm:inline-block">ProofScholar</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80 ${
                location.pathname === link.path ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        {/* Wallet & Mobile Menu */}
        <div className="flex items-center gap-4">
          <WalletBanner />
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

      </div>
    </nav>
  );
}
