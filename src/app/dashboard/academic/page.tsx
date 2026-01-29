'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAcademicYears, createAcademicYear, setCurrentAcademicYear } from '@/features/academic/services/academic-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function AcademicYearPage() {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        isActive: true
    });

    const { data: academicYears, isLoading } = useQuery({
        queryKey: ['academic-years'],
        queryFn: fetchAcademicYears,
    });

    const createMutation = useMutation({
        mutationFn: createAcademicYear,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-years'] });
            setIsCreateOpen(false);
            setFormData({ name: '', startDate: '', endDate: '', isActive: true });
            toast.success('Academic Year created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create academic year');
        }
    });

    const setCurrentMutation = useMutation({
        mutationFn: setCurrentAcademicYear,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-years'] });
            toast.success('Current academic year updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update current year');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Years</h1>
                    <p className="text-muted-foreground">Manage your school's academic sessions and terms.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> Add Academic Year
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Academic Year</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Session Name (e.g., 2024-2025)</Label>
                                <Input
                                    id="name"
                                    placeholder="2024-2025"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch
                                    id="active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="active">Set as Active Year</Label>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Session'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {academicYears?.map((year, index) => (
                    <motion.div
                        key={year._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`relative overflow-hidden transition-all hover:shadow-md ${year.isCurrent ? 'border-primary/50 bg-primary/5' : ''}`}>
                            {year.isCurrent && (
                                <div className="absolute top-2 right-2">
                                    <Badge variant="default" className="bg-primary text-primary-foreground">Current</Badge>
                                </div>
                            )}
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    {year.name}
                                </CardTitle>
                                <CardDescription>
                                    {format(new Date(year.startDate), 'MMM yyyy')} - {format(new Date(year.endDate), 'MMM yyyy')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-4">
                                    <Badge variant={year.isActive ? 'secondary' : 'outline'}>
                                        {year.isActive ? 'Active Status' : 'Inactive'}
                                    </Badge>

                                    {!year.isCurrent && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary hover:text-primary hover:bg-primary/10"
                                            onClick={() => setCurrentMutation.mutate(year._id)}
                                            disabled={setCurrentMutation.isPending}
                                        >
                                            <CheckCircle className="mr-2 h-3.5 w-3.5" />
                                            Set Current
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {academicYears?.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Academic Years Found</h3>
                    <p className="text-muted-foreground">Create your first academic session to get started.</p>
                </div>
            )}
        </div>
    );
}
