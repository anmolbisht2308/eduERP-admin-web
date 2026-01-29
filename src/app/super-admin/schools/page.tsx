'use client';

import { useEffect, useState } from 'react';
import { fetchSchools, School } from '@/features/schools/services/school-service';
import { SchoolList } from '@/features/schools/components/school-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export default function SchoolsPage() {
    const router = useRouter();

    const { data: schools, isLoading, error } = useQuery({
        queryKey: ['schools'],
        queryFn: fetchSchools,
    });

    if (isLoading) return <div>Loading schools...</div>;
    if (error) return <div className="text-red-500">Error loading schools: {(error as any).response?.data?.message || (error as any).message}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
                    <p className="text-muted-foreground">Manage all schools in the system</p>
                </div>
                <Button onClick={() => router.push('/super-admin/schools/create')}>
                    <Plus className="mr-2 h-4 w-4" /> Add School
                </Button>
            </div>

            <SchoolList schools={schools || []} />
        </div>
    );
}
