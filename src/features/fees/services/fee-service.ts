import { api } from '@/lib/api';

export interface FeeHead {
    _id: string;
    name: string;
    description?: string;
    isActive: boolean;
}

export interface FeeStructure {
    _id: string;
    name: string;
    classId: { _id: string; name: string };
    academicYearId: { _id: string; name: string };
    frequency: 'one_time' | 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';
    totalAmount: number;
    feeComponents: Array<{
        feeHeadId: string;
        amount: number;
    }>;
    installments: Array<{
        name: string;
        dueDate: string;
        amount: number;
    }>;
    isActive: boolean;
}

// Fee Heads
export const fetchFeeHeads = async (): Promise<FeeHead[]> => {
    const response = await api.get('/fees/heads');
    return response.data.data;
};

export const createFeeHead = async (data: Partial<FeeHead>) => {
    const response = await api.post('/fees/heads', data);
    return response.data.data;
};

// Fee Structures
export const fetchFeeStructures = async (): Promise<FeeStructure[]> => {
    const response = await api.get('/fees/structures');
    return response.data.data;
};

export const createFeeStructure = async (data: any) => {
    const response = await api.post('/fees/structures', data);
    return response.data.data;
};
