'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, IndianRupee, GraduationCap, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn } from '@/lib/motion';

const stats = [
    {
        title: 'Total Students',
        value: '1,234',
        icon: Users,
        color: 'text-blue-500',
    },
    {
        title: 'Total Revenue',
        value: '₹ 45.2L',
        icon: IndianRupee,
        color: 'text-green-500',
    },
    {
        title: 'Active Classes',
        value: '12',
        icon: GraduationCap,
        color: 'text-purple-500',
    },
    {
        title: 'Pending Invoices',
        value: '23',
        icon: AlertCircle,
        color: 'text-red-500',
    },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
                {stats.map((stat, index) => (
                    <motion.div key={index} variants={fadeIn}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* TODO: Add Charts Here */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Activity Items */}
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">New Student Admitted</p>
                                    <p className="text-sm text-muted-foreground">Rahul Verma - Class 10</p>
                                </div>
                                <div className="ml-auto font-medium">+₹15,000</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
