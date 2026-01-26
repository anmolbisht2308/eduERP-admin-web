'use client';

import { useQuery } from '@tanstack/react-query';
import { getFeeStructures, getInvoices } from '../api/finance';

export const useFeeStructures = () => {
    return useQuery({
        queryKey: ['fee-structures'],
        queryFn: getFeeStructures,
    });
};

export const useInvoices = (params?: any) => {
    return useQuery({
        queryKey: ['invoices', params],
        queryFn: () => getInvoices(params),
    });
};
