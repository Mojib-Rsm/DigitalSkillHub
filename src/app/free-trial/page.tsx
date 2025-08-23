
import { Suspense } from 'react';
import FreeTrialForm from '@/components/free-trial-form';

export default function FreeTrialPage() {
    return (
        <Suspense>
            <FreeTrialForm />
        </Suspense>
    );
}
