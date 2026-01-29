'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStudents, createStudent } from '@/features/students/services/student-service';
import { fetchClasses } from '@/features/classes/services/class-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, UserPlus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function StudentsPage() {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        admissionNumber: '',
        parentName: '',
        parentPhone: '',
        classId: '',
        sectionId: ''
    });

    const { data: students, isLoading: isLoadingStudents } = useQuery({
        queryKey: ['students'],
        queryFn: fetchStudents,
    });

    const { data: classes } = useQuery({
        queryKey: ['classes'],
        queryFn: fetchClasses,
    });

    const createMutation = useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            setIsCreateOpen(false);
            setFormData({
                firstName: '',
                lastName: '',
                admissionNumber: '',
                parentName: '',
                parentPhone: '',
                classId: '',
                sectionId: ''
            });
            toast.success('Student admitted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to admit student');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    if (isLoadingStudents) {
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
                    <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                    <p className="text-muted-foreground">Manage student admissions and enrollments.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="shadow-lg shadow-primary/20">
                                <UserPlus className="mr-2 h-4 w-4" /> Admit Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>New Student Admission</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admissionNumber">Admission Number</Label>
                                    <Input
                                        id="admissionNumber"
                                        placeholder="e.g. ADM-2024-001"
                                        value={formData.admissionNumber}
                                        onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="parentName">Parent Name</Label>
                                        <Input
                                            id="parentName"
                                            value={formData.parentName}
                                            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="parentPhone">Parent Phone</Label>
                                        <Input
                                            id="parentPhone"
                                            value={formData.parentPhone}
                                            onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="class">Class</Label>
                                        <Select onValueChange={(val) => setFormData({ ...formData, classId: val })} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classes?.map((cls) => (
                                                    <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createMutation.isPending}>
                                        {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Admission'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 bg-muted/50 flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        className="max-w-xs h-9 bg-background border-none shadow-none focus-visible:ring-0"
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Info</TableHead>
                            <TableHead>Admission No</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Parent Contact</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students?.map((student) => (
                            <TableRow key={student._id} className="hover:bg-muted/50">
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{student.firstName} {student.lastName}</div>
                                        <div className="text-xs text-muted-foreground">{student._id.slice(-6)}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{student.admissionNumber}</TableCell>
                                <TableCell>
                                    {student.classId?.name}
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">{student.parentName}</div>
                                    <div className="text-xs text-muted-foreground">{student.parentPhone}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                                        {student.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {students?.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No students found. Admit your first student above.
                    </div>
                )}
            </div>
        </div>
    );
}
