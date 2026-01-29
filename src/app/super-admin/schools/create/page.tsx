'use client';

import { CreateSchoolForm } from '@/features/schools/components/create-school-form';

export default function CreateSchoolPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Add New School</h1>
            <CreateSchoolForm />
        </div>
    );
}
