'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface SearchParamsComponentProps {
  onAuthResult: (success: boolean, message: string) => void;
}

export default function SearchParamsComponent({ onAuthResult }: SearchParamsComponentProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const authStatus = searchParams.get('auth');
    const error = searchParams.get('error');

    if (authStatus === 'success') {
      onAuthResult(true, 'Authentication successful!');
    } else if (error) {
      onAuthResult(true, `Error: ${error}`);
    }
  }, [searchParams, onAuthResult]);

  return null;
}
