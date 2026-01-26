'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAcademicYears, createAcademicYear, updateAcademicYear } from '../api/academic';
import { toast } from 'sonner';

export const useAcademicYears = () => {
    return useQuery({
        queryKey: ['academic-years'],
        queryFn: getAcademicYears,
    });
};

export const useCreateAcademicYear = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAcademicYear,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-years'] });
            toast.success('Academic Year Created');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create academic year');
        }
    });
};

export const useUpdateAcademicYear = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => updateAcademicYear(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-years'] });
            toast.success('Academic Year Updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update');
        }
    });
};
