import { useEffect } from 'react';
import {
  CalendarCheck,
  ArrowDown,
  ArrowRight,
  Zap,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Users,
  MapPin,
  Mail,
  Phone,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { DemoBookingModal } from '@/components/DemoBookingModal';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { PricingSection } from '@/components/PricingSection';
import { Footer } from '@/components/Footer';
import { useUIStore } from '@/stores/useUIStore';
import { useLeadStore } from '@/stores/useLeadStore';
import { useDemoStore } from '@/stores/useDemoStore';

function smoothScrollTo(id: string) {
  const el = document.getElementById(id.replace('#', ''));
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const features = [
  {
    icon: Zap,
    title: 'Instant Lead Capture',
    description: 'GDPR-compliant forms that route qualified leads to your CRM in real time.',
  },
  {
    icon: CalendarCheck,
    title: 'Seamless Demo Booking',
    description: 'Built-in scheduling flow so prospects book directly without back-and-forth emails.',
  },
  {
    icon: BarChart3,
    title: 'Conversion-Optimized Layout',
    description: 'Section order, CTAs, and copy proven to maximize demo requests and sign-ups.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy & Compliance Ready',
    description: 'GDPR consent, privacy policy links, and data handling built into every form.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Responsive',
    description: 'Pixel-perfect on every device from a 375px phone to a 4K monitor.',
  },
  {
    icon: Users,
    title: 'Team & CRM Ready',
    description: "Route leads to the right rep or sync with your CRM — no custom code needed.",
  },
];

const testimonials = [
  {
    quote: "We cut our time-to-demo in half. The booking flow alone paid for the first month inside a week.",
    name: 'Sarah K.',
    title: 'VP of Marketing, Meridian',
    avatar: 'https://images.pexels.com/photos/8171180/pexels-photo-8171180.jpeg?auto=compress&cs=tinysrgb&h=130',
    avatarAlt: 'Sarah K., VP of Marketing',
  },
  {
    quote: "Our lead quality jumped. Prospects who come through this page already know what we do — sales calls are shorter and close faster.",
    name: 'James R.',
    title: 'Co-founder, Vaultly',
    avatar: 'https://images.pexels.com/photos/29995591/pexels-photo-29995591.jpeg?auto=compress&cs=tinysrgb&h=130',
    avatarAlt: 'James R., Co-founder',
  },
  {
    quote: "Setup took less than a day. We had our first qualified demo booked before the end of the week. Exactly what a lean team needs.",
    name: 'Priya S.',
    title: 'Head of Growth, Corepath',
    avatar: 'https://images.pexels.com/photos/29995646/pexels-photo-29995646.jpeg?auto=compress&cs=tinysrgb&h=130',
    avatarAlt: 'Priya S., Head of Growth',
  },
];

export default function LandingPage() {
  const openDemoModal = useUIStore((s) => s.openDemoModal);
  const loadLeads = useLeadStore((s) => s.loadLeads);
  const loadBookings = useDemoStore((s) => s.loadBookings);

  useEffect(() => {
    void loadLeads();
    void loadBookings();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <DemoBookingModal />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/8 py-24 md:py-32">
        {/* Dotted grid base layer */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.muted.foreground/0.15)_1px,transparent_1px)] bg-[size:24px_24px]"
          aria-hidden="true"
        />
        {/* Blob accents */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 md:px-6 text-center">
          <Badge
            variant="outline"
            className="mb-6 border-primary/30 bg-primary/5 text-primary text-xs font-medium uppercase tracking-wider"
          >
            Trusted by 500+ B2B software teams
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Turn Visitors Into{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Qualified Pipeline.
            </span>{' '}
            Fast.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground leading-relaxed">
            LaunchPage Pro gives B2B software teams a conversion-optimized landing page that captures leads and books demos — without the guesswork.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={openDemoModal} className="group active:scale-[0.98]">
              <CalendarCheck className="mr-2 h-5 w-5" />
              Book a free demo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => smoothScrollTo('#features')}
              className="group active:scale-[0.98]"
            >
              <ArrowDown className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              See how it works
            </Button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground uppercase tracking-wide">
            No credit card · GDPR compliant · Setup in minutes
          </p>

          {/* Hero screenshot */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border/50 shadow-xl overflow-hidden bg-card">
              <img
                src="https://images.pexels.com/photos/34804005/pexels-photo-34804005.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="LaunchPage Pro product dashboard screenshot"
                className="w-full h-auto object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof Band ── */}
      <section className="border-y border-border/50 bg-muted/30 py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
            Powering growth at
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
            {['Meridian', 'Vaultly', 'Corepath', 'Nuvo', 'Stratix', 'Lumora'].map((name) => (
              <div
                key={name}
                className="text-lg font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">What you get</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need to convert prospects
            </h2>
            <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Built on what actually moves B2B pipeline — from first impression to booked demo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border/60 bg-card p-6 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-200"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mt-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section id="trust" className="py-20 md:py-28 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">Why teams choose us</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Real results from real teams
            </h2>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="rounded-2xl border border-border/60 bg-card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <CardContent className="p-0">
                  <p className="text-base leading-relaxed text-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.avatarAlt}
                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      crossOrigin="anonymous"
                    />
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Case Study Callout */}
          <div className="bg-gradient-to-br from-primary/8 to-accent/8 rounded-2xl border border-primary/20 p-8 mt-12 md:mt-16">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1">
                <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary mb-4">
                  Case Study
                </Badge>
                <h3 className="text-2xl font-bold tracking-tight">
                  How Meridian grew demo bookings by 3× in 60 days
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  Meridian had the right product but the wrong page. After switching to LaunchPage Pro, their sales team went from chasing cold leads to handling a full inbound calendar. Here&apos;s the breakdown of what changed and what drove the numbers.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 active:scale-[0.98] transition-all"
                  onClick={() => smoothScrollTo('#contact')}
                >
                  Read the full case study
                </Button>
              </div>

              <div className="flex flex-row md:flex-col gap-8 md:gap-6 flex-shrink-0">
                <div className="text-center md:text-left">
                  <p className="text-3xl font-bold tabular-nums text-primary">3×</p>
                  <p className="text-xs text-muted-foreground mt-1">demo bookings</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl font-bold tabular-nums text-primary">42%</p>
                  <p className="text-xs text-muted-foreground mt-1">lead conversion</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-3xl font-bold tabular-nums text-primary">60</p>
                  <p className="text-xs text-muted-foreground mt-1">days to results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <PricingSection />

      {/* ── Contact / Lead Capture Section ── */}
      <section id="contact" className="py-20 md:py-28 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">Get in touch</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Ready to see LaunchPage Pro in action?
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Fill in the form and our team will be in touch within one business day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left: contact info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Office</p>
                    <p className="text-sm text-muted-foreground">123 Market St, Suite 400{'\n'}San Francisco, CA 94105</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a href="mailto:hello@launchpagepro.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      hello@launchpagepro.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a href="tel:+14155550190" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      +1 (415) 555-0190
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hours</p>
                    <p className="text-sm text-muted-foreground">Mon–Fri, 9 AM–6 PM PT</p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="active:scale-[0.98] transition-all group"
                onClick={() => useUIStore.getState().openDemoModal()}
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                Book a demo instead
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>

            {/* Right: form */}
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 md:p-8">
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA Banner ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="bg-gradient-to-br from-primary via-primary to-accent rounded-3xl max-w-6xl mx-auto p-12 md:p-16 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Start converting visitors today.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base md:text-lg opacity-90">
            Join 500+ B2B software teams already using LaunchPage Pro to fill their pipeline.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 active:scale-[0.98]"
            onClick={openDemoModal}
          >
            Book your free demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs opacity-70 mt-4">No credit card required · Cancel any time</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}