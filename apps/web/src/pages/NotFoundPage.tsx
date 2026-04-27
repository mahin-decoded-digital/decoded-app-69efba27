import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="h-16 w-16 text-muted-foreground/40" />
      <h1 className="text-3xl font-bold tracking-tight mt-6">Page not found</h1>
      <p className="text-base text-muted-foreground mt-2 max-w-sm leading-relaxed">
        {"The page you're looking for doesn't exist or has moved."}
      </p>
      <Button
        className="mt-8 active:scale-[0.98]"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Button>
    </div>
  );
}
