'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfettiExplosion from 'react-confetti-explosion';

export default function AuthSuccessPage() {
  const [isExploding, setIsExploding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsExploding(true);
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>You successfully claimed your Milady Account!</h1>
      {isExploding && <ConfettiExplosion />}
    </div>
  );
}
