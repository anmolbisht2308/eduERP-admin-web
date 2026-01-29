'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClasses, createClass } from '@/features/classes/services/class-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, BookOpen, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ClassesPage() {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        sectionName: '' // Optional default section
    });

    const { data: classes, isLoading } = useQuery({
        queryKey: ['classes'],
        queryFn: fetchClasses,
    });

    const createMutation = useMutation({
        mutationFn: createClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            setIsCreateOpen(false);
            setFormData({ name: '', sectionName: '' });
            toast.success('Class created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create class');
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
                    <h1 className="text-3xl font-bold tracking-tight">Classes & Sections</h1>
                    <p className="text-muted-foreground">Define your school's grade levels and their divisions.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> Add New Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Class</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Class Name (e.g., Class 1, Grade 10)</Label>
                                <Input
                                    id="name"
                                    placeholder="Class 1"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="section">Default Section (Optional)</Label>
                                <Input
                                    id="section"
                                    placeholder="A"
                                    value={formData.sectionName}
                                    onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">You can add more sections later.</p>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Class'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classes?.map((cls, index) => (
                    <motion.div
                        key={cls._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:shadow-md transition-all">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                    </div>
                                    {cls.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <Layers className="h-3 w-3" />
                                    {(cls.sections || []).length} Sections
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {cls.sections && cls.sections.length > 0 ? (
                                        cls.sections.map((sec: any) => (
                                            <Badge key={sec._id || sec} variant="secondary" className="px-2 py-1">
                                                Section {sec.name || sec}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">No sections added</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {classes?.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                    <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Classes Found</h3>
                    <p className="text-muted-foreground">Start by creating your first grade level.</p>
                </div>
            )}
        </div>
    );
}
