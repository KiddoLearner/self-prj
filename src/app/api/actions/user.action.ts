'use server';


import { server } from '@/src/lib/auth/server';
import { neon } from '@neondatabase/serverless';

export async function getUserDetails(userId: string | undefined) {
    const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!userId) {
    return null;
  }

  const sql = neon(databaseUrl);
  const [user] =
    await sql`SELECT * FROM neon_auth.user WHERE id = ${userId};`;
  return user ?? null;
}

export async function getUserId() {
  const { data: session } = await server.getSession();

  return session?.user?.id ?? null;
}

