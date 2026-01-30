import { api } from '@/lib/api';

export interface Student {
    _id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    rollNumber?: string;
    parentName: string;
    parentPhone: string;
    status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'dropped';
    classId: { _id: string; name: string };
    sectionId?: { _id: string; name: string };
}

export const fetchStudents = async (): Promise<Student[]> => {
    const response = await api.get('/students');
    return response.data.data.students;
};

export const createStudent = async (data: any) => {
    const response = await api.post('/students', data);
    return response.data.data;
};
