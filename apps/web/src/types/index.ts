export interface Lead {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
  company: string;
  message: string;
  gdprConsent: boolean;
  source: 'contact-form' | 'demo-request';
}

export interface DemoBooking {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
  company: string;
  preferredDate: string;
  preferredTime: '09:00' | '10:00' | '11:00' | '14:00' | '15:00' | '16:00';
  timezone: string;
  status: 'pending' | 'confirmed';
}
