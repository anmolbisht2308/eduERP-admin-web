'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', total: 150000 },
    { name: 'Feb', total: 230000 },
    { name: 'Mar', total: 180000 },
    { name: 'Apr', total: 320000 },
    { name: 'May', total: 250000 },
    { name: 'Jun', total: 300000 },
];

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Revenue Collection</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Placeholder for other charts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Outstanding Dues by Class</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
                        Coming Soon: Pie Chart
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
