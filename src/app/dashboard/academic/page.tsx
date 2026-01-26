'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAcademicYears } from '@/features/academic/hooks/use-academic';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { CreateYearForm } from '@/features/academic/components/create-year-form';
import { useState } from 'react';
import { format } from 'date-fns';

export default function AcademicPage() {
    const { data: years, isLoading } = useAcademicYears();
    const [open, setOpen] = useState(false);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Academic Years</h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create New
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Academic Year</DialogTitle>
                        </DialogHeader>
                        <CreateYearForm onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {years?.map((year) => (
                                <TableRow key={year._id}>
                                    <TableCell className="font-medium">{year.name}</TableCell>
                                    <TableCell>{format(new Date(year.startDate), 'dd MMM yyyy')}</TableCell>
                                    <TableCell>{format(new Date(year.endDate), 'dd MMM yyyy')}</TableCell>
                                    <TableCell>
                                        {year.isCurrent ? <Badge>Current</Badge> : <Badge variant="secondary">Past</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {years?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No academic years found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
