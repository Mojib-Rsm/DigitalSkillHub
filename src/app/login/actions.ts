
'use server'
 
import { signIn } from '@/auth'
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', Object.fromEntries(formData))
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('NEXT_REDIRECT')) {
        throw error;
      }
      if (error.message.includes('CredentialsSignin')) {
        return 'Invalid email or password.';
      }
    }
    // Return the specific error message from the authorize function
    return (error as Error).message;
  }
}
