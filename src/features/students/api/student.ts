import { api } from '@/lib/api';

export const getStudents = async (params?: any) => {
    const { data } = await api.get('/students', { params });
    return data.data; // { students: [], total, page }
};

export const createStudent = async (data: any) => {
    const { data: res } = await api.post('/students', data);
    return res.data;
};
