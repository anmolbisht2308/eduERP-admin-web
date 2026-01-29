import { api } from '@/lib/api';

export interface School {
    _id: string;
    name: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
    isActive: boolean;
    createdAt: string;
}

export const fetchSchools = async (): Promise<School[]> => {
    const response = await api.get('/schools');
    return response.data.data.schools; // Matches API response structure
};

export const createSchool = async (data: any) => {
    const response = await api.post('/schools', data);
    return response.data;
};
