'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { useCreateStudent } from '../hooks/use-students';
import { Loader2 } from 'lucide-react';
import { useAcademicYears } from '@/features/academic/hooks/use-academic';

// Basic schema - expand as needed
const schema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    admissionNumber: z.string().min(1, 'Admission No. is required'),
    gender: z.enum(['male', 'female', 'other']),
    parentName: z.string().min(1, 'Parent Name is required'),
    parentPhone: z.string().min(10, 'Valid Phone is required'),
    academicYearId: z.string().min(1, 'Academic Year is required'),
    // Class/Section would be selects too, mocking generic string for simplicity
    classId: z.string().optional(),
    sectionId: z.string().optional(),
});

export function AdmissionForm({ onSuccess }: { onSuccess: () => void }) {
    const { mutate, isPending } = useCreateStudent();
    const { data: years } = useAcademicYears();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            admissionNumber: '',
            gender: 'male' as const,
            parentName: '',
            parentPhone: '',
            academicYearId: '',
        }
    });

    const onSubmit = (data: any) => {
        // Inject current class/section IDs from context or selection
        // For MVP, passing as is. 
        mutate(data, {
            onSuccess: () => {
                onSuccess();
                form.reset();
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="admissionNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Admission Number</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="academicYearId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Academic Year</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {years?.map((y) => (
                                        <SelectItem key={y._id} value={y._id}>{y.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="parentName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="parentPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent Phone</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Admit Student
                </Button>
            </form>
        </Form>
    );
}
