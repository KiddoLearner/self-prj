'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/src/lib/auth/client';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignOut() {
    setIsLoading(true);
    setError('');

    try {
      const result = await authClient.signOut();

      if (result?.error) {
        setError(result.error.message ?? 'Unable to sign out');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out failed:', error);
      setError('Unable to sign out');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isLoading}
        className="flex items-center gap-2 cursor-pointer"
      >
        <LogOut className="w-4 h-4"/>
        <span className="hidden lg:inline">{isLoading ? 'Signing out...' : 'Sign out'}</span>
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}