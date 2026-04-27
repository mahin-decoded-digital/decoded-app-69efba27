import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/useUIStore';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Trust', href: '#trust' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

function smoothScrollTo(id: string) {
  const el = document.getElementById(id.replace('#', ''));
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const openDemoModal = useUIStore((s) => s.openDemoModal);

  function handleNavClick(href: string) {
    smoothScrollTo(href);
    setMobileOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight text-foreground">LaunchPage Pro</span>
        </Link>

        {/* Center nav — desktop only */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            size="sm"
            onClick={openDemoModal}
          >
            Book a demo
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => smoothScrollTo('#contact')}
          >
            Sign up
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-200',
          mobileOpen ? 'max-h-96 border-b border-border/40' : 'max-h-0'
        )}
      >
        <div className="px-4 pb-4 pt-2 space-y-1 bg-background">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button size="sm" onClick={() => { openDemoModal(); setMobileOpen(false); }} className="w-full">
              Book a demo
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { smoothScrollTo('#contact'); setMobileOpen(false); }} className="w-full">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
