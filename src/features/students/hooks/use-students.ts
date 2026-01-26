'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudents, createStudent } from '../api/student';
import { toast } from 'sonner';

export const useStudents = (params?: any) => {
    return useQuery({
        queryKey: ['students', params],
        queryFn: () => getStudents(params),
    });
};

export const useCreateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast.success('Student Admitted Successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Admission failed');
        }
    });
};
