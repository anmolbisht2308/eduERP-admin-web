import { api } from '@/lib/api';

export interface Payment {
    _id: string;
    invoiceId: string;
    amount: number;
    paymentMethod: 'cash' | 'online' | 'cheque' | 'bank_transfer';
    paymentDate: string;
    receiptNumber: string;
}

export const fetchPayments = async (invoiceId?: string): Promise<Payment[]> => {
    const url = invoiceId ? `/payments?invoiceId=${invoiceId}` : '/payments';
    const response = await api.get(url);
    return response.data.data;
};

export const recordPayment = async (data: any) => {
    const response = await api.post('/payments', data);
    return response.data.data;
};
