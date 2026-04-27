import { Rocket, Twitter, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

function smoothScrollTo(id: string) {
  const el = document.getElementById(id.replace('#', ''));
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Rocket className="h-4 w-4" />
              </div>
              <span className="font-semibold tracking-tight">LaunchPage Pro</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
              The conversion-optimized landing page platform for B2B software teams.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {[
                { label: 'Features', anchor: '#features' },
                { label: 'Pricing', anchor: '#pricing' },
                { label: 'Demo', anchor: null },
                { label: 'Sign up', anchor: '#contact' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => item.anchor && smoothScrollTo(item.anchor)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground/50 cursor-not-allowed">Blog</span>
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <span>© 2024 LaunchPage Pro. All rights reserved.</span>
          <span>GDPR Compliant · SOC 2 Ready</span>
        </div>
      </div>
    </footer>
  );
}
