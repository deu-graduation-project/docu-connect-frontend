'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react'; // Import cancellation icon

function CartContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isCanceled = searchParams.get('payment_canceled') === 'true';
  const [countdown, setCountdown] = useState(5);

  // Countdown and redirect effect
  useEffect(() => {
    if (!isCanceled) return; // Only run countdown if payment was canceled

    if (countdown <= 0) {
      router.push("/dashboard/profile") // Redirect to homepage
      return;
    }

    const timerId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timerId); // Cleanup interval
  }, [countdown, router, isCanceled]);

  // Effect to handle direct access without the cancellation parameter
   useEffect(() => {
    if (!isCanceled) {
       // Use a timeout to allow Suspense fallback to show briefly if needed,
       // or redirect immediately. Immediate redirect might be better UX.
       router.replace("/dashboard/profile") // Use replace to avoid adding to browser history
    }
  }, [isCanceled, router]); // Depend on isCanceled and router

  if (!isCanceled) {
     // This content will likely not be seen due to the immediate redirect,
     // but serves as a fallback during the brief moment before redirection.
    return <div className="flex min-h-screen items-center justify-center">Yönlendiriliyor...</div>;
  }

  // Display cancellation message
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive"> {/* Use destructive border */}
        <CardHeader className="items-center text-center">
          <XCircle className="h-16 w-16 text-destructive" /> {/* Use destructive color */}
          <CardTitle className="mt-4 text-2xl font-bold text-destructive">Ödeme İptal Edildi</CardTitle>
          <CardDescription>Ödeme işlemi başarıyla iptal edildi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
           <p className="text-md text-muted-foreground">
            Profilinize yönlendiriliyorsunuz: {countdown} saniye...
          </p>
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link href="/dashboard/profile">Profile Dön</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap the component in Suspense as useSearchParams requires it
export default function CartPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Yükleniyor...</div>}>
      <CartContent />
    </Suspense>
  );
}
