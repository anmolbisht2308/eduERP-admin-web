'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFeeHeads, createFeeHead, fetchFeeStructures, createFeeStructure } from '@/features/fees/services/fee-service';
import { fetchClasses } from '@/features/classes/services/class-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, DollarSign, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function FeesPage() {
    const queryClient = useQueryClient();
    const [isHeadDialogOpen, setIsHeadDialogOpen] = useState(false);
    const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false);

    // Form States
    const [headFormData, setHeadFormData] = useState({ name: '', description: '' });
    const [structureFormData, setStructureFormData] = useState({
        name: '',
        classId: '',
        frequency: 'yearly' as const,
        feeComponents: [{ feeHeadId: '', amount: 0 }]
    });

    const { data: feeHeads, isLoading: isLoadingHeads } = useQuery({
        queryKey: ['fee-heads'],
        queryFn: fetchFeeHeads,
    });

    const { data: feeStructures, isLoading: isLoadingStructures } = useQuery({
        queryKey: ['fee-structures'],
        queryFn: fetchFeeStructures,
    });

    const { data: classes } = useQuery({
        queryKey: ['classes'],
        queryFn: fetchClasses,
    });

    const createHeadMutation = useMutation({
        mutationFn: createFeeHead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fee-heads'] });
            setIsHeadDialogOpen(false);
            setHeadFormData({ name: '', description: '' });
            toast.success('Fee Head created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create fee head');
        }
    });

    const createStructureMutation = useMutation({
        mutationFn: createFeeStructure,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fee-structures'] });
            setIsStructureDialogOpen(false);
            toast.success('Fee Structure created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create fee structure');
        }
    });

    const handleCreateHead = (e: React.FormEvent) => {
        e.preventDefault();
        createHeadMutation.mutate(headFormData);
    };

    const handleCreateStructure = (e: React.FormEvent) => {
        e.preventDefault();
        const totalAmount = structureFormData.feeComponents.reduce((sum, comp) => sum + comp.amount, 0);
        createStructureMutation.mutate({ ...structureFormData, totalAmount });
    };

    if (isLoadingHeads || isLoadingStructures) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
                <p className="text-muted-foreground">Configure fee heads and structures for your school.</p>
            </div>

            <Tabs defaultValue="heads" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="heads">Fee Heads</TabsTrigger>
                    <TabsTrigger value="structures">Fee Structures</TabsTrigger>
                </TabsList>

                <TabsContent value="heads" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isHeadDialogOpen} onOpenChange={setIsHeadDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="shadow-lg shadow-primary/20">
                                    <Plus className="mr-2 h-4 w-4" /> Add Fee Head
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Fee Head</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateHead} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="headName">Fee Head Name</Label>
                                        <Input
                                            id="headName"
                                            placeholder="e.g., Tuition Fee, Library Fee"
                                            value={headFormData.name}
                                            onChange={(e) => setHeadFormData({ ...headFormData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="headDesc">Description (Optional)</Label>
                                        <Input
                                            id="headDesc"
                                            placeholder="Brief description"
                                            value={headFormData.description}
                                            onChange={(e) => setHeadFormData({ ...headFormData, description: e.target.value })}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={createHeadMutation.isPending}>
                                            {createHeadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Head'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {feeHeads?.map((head, index) => (
                            <motion.div
                                key={head._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <DollarSign className="h-4 w-4 text-primary" />
                                            </div>
                                            {head.name}
                                        </CardTitle>
                                    </CardHeader>
                                    {head.description && (
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">{head.description}</p>
                                        </CardContent>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {feeHeads?.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No Fee Heads Found</h3>
                            <p className="text-muted-foreground">Create your first fee category to get started.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="structures" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isStructureDialogOpen} onOpenChange={setIsStructureDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="shadow-lg shadow-primary/20">
                                    <Plus className="mr-2 h-4 w-4" /> Add Fee Structure
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Create Fee Structure</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateStructure} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="structureName">Structure Name</Label>
                                            <Input
                                                id="structureName"
                                                placeholder="e.g., Class 1 Annual Fee"
                                                value={structureFormData.name}
                                                onChange={(e) => setStructureFormData({ ...structureFormData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="class">Class</Label>
                                            <Select onValueChange={(val) => setStructureFormData({ ...structureFormData, classId: val })} required>
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
                                        <div className="space-y-2">
                                            <Label htmlFor="frequency">Frequency</Label>
                                            <Select value={structureFormData.frequency} onValueChange={(val: any) => setStructureFormData({ ...structureFormData, frequency: val })} required>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="yearly">Yearly</SelectItem>
                                                    <SelectItem value="half_yearly">Half Yearly</SelectItem>
                                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={createStructureMutation.isPending}>
                                            {createStructureMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Structure'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Structure Name</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Frequency</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feeStructures?.map((structure) => (
                                    <TableRow key={structure._id}>
                                        <TableCell className="font-medium">{structure.name}</TableCell>
                                        <TableCell>{structure.classId?.name}</TableCell>
                                        <TableCell className="capitalize">{structure.frequency.replace('_', ' ')}</TableCell>
                                        <TableCell>₹{structure.totalAmount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={structure.isActive ? 'default' : 'secondary'}>
                                                {structure.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {feeStructures?.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Receipt className="h-12 w-12 mx-auto mb-4" />
                                No fee structures configured yet.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
