'use client'; // Add this line to mark the component as a Client Component

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
// Remove unused Link import
// import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// Remove Button import as it's no longer used directly for navigation
// import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter(); // Initialize router
  const [countdown, setCountdown] = useState(5); // Add countdown state

  // Add useEffect for countdown and redirect
  useEffect(() => {
    if (countdown <= 0) {
      router.push('/dashboard/profile'); // Redirect to dashboard
      return;
    }

    const timerId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timerId); // Cleanup interval on unmount
  }, [countdown, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <CardTitle className="mt-4 text-2xl font-bold">Ödeme Başarılı!</CardTitle>
          <CardDescription>Siparişiniz başarıyla işlendi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {sessionId ? (
            <div>
              <p className="text-sm text-muted-foreground">Stripe Oturum Kimliğiniz:</p>
              <p className="break-all text-sm font-medium">{sessionId}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                Bu kimliği referans olarak kullanabilirsiniz.
              </p>
            </div>
          ) : (
            <p className="text-sm text-destructive">
              Oturum kimliği bulunamadı. {/* Corrected typo */}
            </p>
          )}
          {/* Replace Button with countdown display */}
          <p className="mt-6 text-md text-muted-foreground">
            Profilinize yönlendiriliyorsunuz: {countdown} saniye...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap the component in Suspense as useSearchParams requires it
export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
