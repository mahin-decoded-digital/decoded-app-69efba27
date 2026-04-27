import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/stores/useUIStore';

function smoothScrollTo(id: string) {
  const el = document.getElementById(id.replace('#', ''));
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const starterFeatures = [
  'Up to 3 lead captures / month',
  'GDPR-compliant forms',
  'Mobile-responsive layout',
  'Email notifications',
];

const growthFeatures = [
  'Unlimited lead captures',
  'Demo booking flow',
  'CRM integrations (HubSpot, Salesforce)',
  'A/B testing (2 variants)',
  'Priority email support',
  'Custom domain',
];

const enterpriseFeatures = [
  'Everything in Growth',
  'Unlimited A/B variants',
  'Dedicated onboarding & CSM',
  'SSO & advanced security',
  'SLA & compliance documentation',
];

export function PricingSection() {
  const openDemoModal = useUIStore((s) => s.openDemoModal);

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Pricing</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Starter */}
          <Card className="rounded-2xl border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Starter</CardTitle>
              <CardDescription>For early-stage teams.</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tabular-nums">$0</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {starterFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full active:scale-[0.98] transition-all"
                variant="outline"
                onClick={() => smoothScrollTo('#contact')}
              >
                Start free
              </Button>
            </CardContent>
          </Card>

          {/* Growth — featured */}
          <Card className="relative rounded-2xl border border-primary/40 shadow-lg md:scale-105 bg-gradient-to-b from-primary/5 to-transparent hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
              Most popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Growth</CardTitle>
              <CardDescription>For scaling B2B teams.</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tabular-nums">$149</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {growthFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full active:scale-[0.98] transition-all"
                onClick={openDemoModal}
              >
                Start 14-day trial
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="rounded-2xl border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Enterprise</CardTitle>
              <CardDescription>For large sales orgs.</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tabular-nums">Custom</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {enterpriseFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full active:scale-[0.98] transition-all"
                variant="outline"
                onClick={openDemoModal}
              >
                Contact sales
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">
          All plans include GDPR-compliant forms, mobile-responsive layout, and dedicated onboarding.
        </p>
      </div>
    </section>
  );
}
