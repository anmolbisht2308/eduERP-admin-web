import { api } from '@/lib/api';

export interface Invoice {
    _id: string;
    invoiceNumber: string;
    studentId: { _id: string; firstName: string; lastName: string; admissionNumber: string };
    invoiceDate: string;
    dueDate: string;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    status: 'pending' | 'partially_paid' | 'paid' | 'cancelled' | 'overdue';
}

export const fetchInvoices = async (): Promise<Invoice[]> => {
    const response = await api.get('/invoices');
    return response.data.data;
};

export const createInvoice = async (data: any) => {
    const response = await api.post('/invoices', data);
    return response.data.data;
};

export const getInvoiceDetails = async (id: string) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data.data;
};
