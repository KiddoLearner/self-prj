'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/src/lib/auth/client';

export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try{
        const result = await authClient.signIn.email({email: email.trim(), password: password,});
        if (result.error) {
            setError(result.error.message ?? 'Invalid email or password');
            return;
        }
        router.push('/projects');
        router.refresh();
    }
    catch(e){
        if (e instanceof Error) {
            setError(e.message);
            //alert(Error);
        } else {
            setError('Invalid email or password');
            //alert(Error);
        }
        router.refresh();
    }finally{
        setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-900"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="m@example.com"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-900"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Signing in...' : 'Login'}
      </button>
    </form>
  );
}