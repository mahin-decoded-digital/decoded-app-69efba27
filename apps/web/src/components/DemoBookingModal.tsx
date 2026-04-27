import { useState } from 'react';
import { CalendarCheck, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUIStore } from '@/stores/useUIStore';
import { useDemoStore } from '@/stores/useDemoStore';
import type { DemoBooking } from '@/types';
import { cn } from '@/lib/utils';

const TIME_SLOTS: DemoBooking['preferredTime'][] = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00',
];

const TIME_LABELS: Record<DemoBooking['preferredTime'], string> = {
  '09:00': '9:00 AM',
  '10:00': '10:00 AM',
  '11:00': '11:00 AM',
  '14:00': '2:00 PM',
  '15:00': '3:00 PM',
  '16:00': '4:00 PM',
};

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

function generateICS(booking: DemoBooking): string {
  const date = booking.preferredDate.replace(/-/g, '');
  const parts = booking.preferredTime.split(':');
  const h = parts[0] ?? '09';
  const m = parts[1] ?? '00';
  const startHour = parseInt(h, 10);
  const endHour = startHour + 1;
  const dtStart = `${date}T${String(startHour).padStart(2, '0')}${m}00`;
  const dtEnd = `${date}T${String(endHour).padStart(2, '0')}${m}00`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'SUMMARY:LaunchPage Pro Demo',
    'DESCRIPTION:Your demo with the LaunchPage Pro team.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function downloadICS(booking: DemoBooking) {
  const ics = generateICS(booking);
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'launchpagepro-demo.ics';
  a.click();
  URL.revokeObjectURL(url);
}

export function DemoBookingModal() {
  const demoModalOpen = useUIStore((s) => s.demoModalOpen);
  const closeDemoModal = useUIStore((s) => s.closeDemoModal);
  const bookDemo = useDemoStore((s) => s.bookDemo);
  const lastBooking = useDemoStore((s) => s.lastBooking);
  const clearLastBooking = useDemoStore((s) => s.clearLastBooking);
  const isSubmitting = useDemoStore((s) => s.isSubmitting);
  const storeSubmitError = useDemoStore((s) => s.submitError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState<DemoBooking['preferredTime'] | ''>('');
  const [timezone] = useState(detectTimezone);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(field: string, value: string): string {
    if (field === 'email') {
      if (!value.trim()) return 'This field is required.';
      if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    }
    if (!value.trim()) return 'This field is required.';
    return '';
  }

  function handleBlur(field: string, value: string) {
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  }

  function handleClose() {
    closeDemoModal();
    setTimeout(() => {
      setName('');
      setEmail('');
      setCompany('');
      setPreferredDate('');
      setPreferredTime('');
      setErrors({});
      setSubmitError('');
      clearLastBooking();
    }, 300);
  }

  const isFormValid =
    name.trim() !== '' &&
    email.trim() !== '' &&
    emailRegex.test(email.trim()) &&
    company.trim() !== '' &&
    preferredDate.trim() !== '' &&
    preferredTime !== '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!preferredTime) {
      setSubmitError('Please fill in all scheduling fields.');
      return;
    }
    const result = await bookDemo({
      name,
      email,
      company,
      preferredDate,
      preferredTime: preferredTime as DemoBooking['preferredTime'],
      timezone,
    });
    if (!result.ok) {
      setSubmitError(result.error ?? 'Something went wrong.');
    }
  }

  const confirmed = lastBooking !== null && demoModalOpen;

  return (
    <Dialog open={demoModalOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        {confirmed && lastBooking ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
              <CalendarCheck className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Your demo is confirmed!</DialogTitle>
            <DialogDescription className="mt-2 text-base text-muted-foreground">
              We have you down for{' '}
              <span className="font-semibold text-foreground">
                {lastBooking.preferredDate}
              </span>{' '}
              at{' '}
              <span className="font-semibold text-foreground">
                {TIME_LABELS[lastBooking.preferredTime]}
              </span>{' '}
              ({lastBooking.timezone}).
            </DialogDescription>
            <p className="mt-1 text-sm text-muted-foreground">
              A confirmation will be sent to{' '}
              <span className="font-medium text-foreground">{lastBooking.email}</span>.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => downloadICS(lastBooking)}
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                Add to calendar
              </Button>
              <Button className="flex-1" onClick={handleClose}>
                <Check className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight">Book a free demo</DialogTitle>
              <DialogDescription>
                Pick a time and our team will walk you through LaunchPage Pro — no pressure, no prep needed.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="demo-name">
                  Full name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="demo-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('name', name)}
                  placeholder="Jane Smith"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="demo-email">
                  Work email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="demo-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email', email)}
                  placeholder="jane@company.com"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="demo-company">
                  Company <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="demo-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onBlur={() => handleBlur('company', company)}
                  placeholder="Acme Corp"
                />
                {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="demo-date">
                    Preferred date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="demo-date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    onBlur={() => handleBlur('preferredDate', preferredDate)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.preferredDate && (
                    <p className="text-xs text-destructive">{errors.preferredDate}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="demo-time">
                    Preferred time <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="demo-time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value as DemoBooking['preferredTime'])}
                    className={cn(
                      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      !preferredTime && 'text-muted-foreground'
                    )}
                  >
                    <option value="" disabled>Select time</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{TIME_LABELS[slot]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                  {timezone}
                </div>
                <p className="text-xs text-muted-foreground">Auto-detected from your browser</p>
              </div>
            </div>

            {(submitError || storeSubmitError) && (
              <p className="mt-4 text-sm text-destructive">{submitError || storeSubmitError}</p>
            )}

            <div className="mt-6 flex gap-3">
              <Button type="submit" className="flex-1" disabled={!isFormValid || isSubmitting}>
                <CalendarCheck className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Confirming...' : 'Confirm booking'}
              </Button>
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}