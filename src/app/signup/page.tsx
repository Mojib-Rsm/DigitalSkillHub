
import { Suspense } from 'react';
import SignupForm from '@/components/signup-form';

export default function SignUpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
}
