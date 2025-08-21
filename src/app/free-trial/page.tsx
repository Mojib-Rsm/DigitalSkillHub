

"use client";

import { Suspense } from 'react';
import FreeTrialForm from '@/components/free-trial-form';

export default function FreeTrialPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FreeTrialForm />
        </Suspense>
    );
}
