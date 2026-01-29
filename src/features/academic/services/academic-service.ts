import { api } from '@/lib/api';

export interface AcademicYear {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isCurrent: boolean;
}

export const fetchAcademicYears = async (): Promise<AcademicYear[]> => {
    const response = await api.get('/academic');
    return response.data.data;
};

export const createAcademicYear = async (data: Partial<AcademicYear>) => {
    const response = await api.post('/academic', data);
    return response.data.data;
};

export const setCurrentAcademicYear = async (id: string) => {
    const response = await api.patch(`/academic/${id}/set-current`);
    return response.data.data;
};
