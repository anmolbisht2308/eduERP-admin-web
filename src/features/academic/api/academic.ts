import { api } from '@/lib/api';

export interface AcademicYear {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
}

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
    const { data } = await api.get('/academic-years');
    return data.data;
};

export const createAcademicYear = async (data: Partial<AcademicYear>) => {
    const { data: res } = await api.post('/academic-years', data);
    return res.data;
};

export const updateAcademicYear = async (id: string, data: Partial<AcademicYear>) => {
    const { data: res } = await api.patch(`/academic-years/${id}`, data);
    return res.data;
};
