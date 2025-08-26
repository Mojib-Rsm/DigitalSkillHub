
import { redirect } from 'next/navigation';

export default function SignUpPage() {
    // Redirect users to the login page where they can sign up with Google.
    // This centralizes the authentication flow.
    redirect('/login');
}
