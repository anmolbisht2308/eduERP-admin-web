'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button variant="outline" onClick={handleLogout}>
                    Logout
                </Button>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow border border-gray-100 dark:border-zinc-800">
                <h2 className="text-xl font-semibold mb-4">Welcome back, {user.name}!</h2>
                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p>Role: <span className="font-medium capitalize">{user.role.replace('_', ' ')}</span></p>
                    <p>Email: {user.email}</p>
                    {user.schoolId && <p>School ID: {user.schoolId}</p>}
                </div>
            </div>
        </div>
    );
}
