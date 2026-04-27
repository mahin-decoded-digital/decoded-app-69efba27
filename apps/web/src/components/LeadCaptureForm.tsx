import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLeadStore } from '@/stores/useLeadStore';

export function LeadCaptureForm() {
  const submitLead = useLeadStore((s) => s.submitLead);
  const lastSubmittedLead = useLeadStore((s) => s.lastSubmittedLead);
  const clearLastSubmitted = useLeadStore((s) => s.clearLastSubmitted);
  const isSubmitting = useLeadStore((s) => s.isSubmitting);
  const storeSubmitError = useLeadStore((s) => s.submitError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(field: string, value: string | boolean): string {
    if (field === 'email' && typeof value === 'string') {
      if (!value.trim()) return 'This field is required.';
      if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    }
    if (field === 'gdprConsent') {
      return '';
    }
    if (typeof value === 'string' && !value.trim()) return 'This field is required.';
    return '';
  }

  function handleBlur(field: string, value: string | boolean) {
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  }

  const isFormValid =
    name.trim() &&
    email.trim() &&
    emailRegex.test(email.trim()) &&
    company.trim() &&
    gdprConsent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError('');
    const result = await submitLead({
      name,
      email,
      company,
      message,
      gdprConsent,
      source: 'contact-form',
    });
    if (!result.ok) {
      setSubmitError(result.error ?? 'Something went wrong.');
    }
  }

  function handleReset() {
    clearLastSubmitted();
    setName('');
    setEmail('');
    setCompany('');
    setMessage('');
    setGdprConsent(false);
    setErrors({});
    setSubmitError('');
  }

  if (lastSubmittedLead) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">Message received!</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {"We'll be in touch within one business day."}
        </p>
        <button
          onClick={handleReset}
          className="mt-6 text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="contact-name">Name <span className="text-destructive">*</span></Label>
        <Input
          id="contact-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur('name', name)}
          placeholder="Your full name"
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-email">Email <span className="text-destructive">*</span></Label>
        <Input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email', email)}
          placeholder="you@company.com"
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-company">Company <span className="text-destructive">*</span></Label>
        <Input
          id="contact-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          onBlur={() => handleBlur('company', company)}
          placeholder="Your company name"
        />
        {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Tell us about your team and what you're trying to solve..."
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <input
            id="gdpr-consent"
            type="checkbox"
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary cursor-pointer accent-primary"
          />
          <label htmlFor="gdpr-consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
            I agree to the{' '}
            <a href="#" className="text-primary hover:underline underline-offset-4">Privacy Policy</a>
            {' '}and consent to being contacted.
          </label>
        </div>
        {!gdprConsent && (
          <p className="text-xs text-muted-foreground pl-7">
            You must accept the privacy policy to continue.
          </p>
        )}
      </div>

      {(submitError || storeSubmitError) && (
        <p className="text-sm text-destructive">{submitError || storeSubmitError}</p>
      )}

      <Button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="w-full group"
        size="lg"
      >
        <Send className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  );
}