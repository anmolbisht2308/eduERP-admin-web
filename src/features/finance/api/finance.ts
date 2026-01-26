import { api } from '@/lib/api';

export const getFeeStructures = async () => {
    const { data } = await api.get('/fees/structures');
    return data.data;
};

export const getInvoices = async (params?: any) => {
    const { data } = await api.get('/invoices', { params });
    return data.data; // { invoices: [], total }
};
