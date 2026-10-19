import { cookies } from 'next/headers';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_user');

    if (!sessionCookie) return null;

    return JSON.parse(sessionCookie.value);
  } catch (error) {
    return null;
  }
}