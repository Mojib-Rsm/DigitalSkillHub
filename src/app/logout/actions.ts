
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  // Clear the session cookie
  cookies().delete('auth-session');
  
  // Redirect to the login page
  redirect('/login');
}
