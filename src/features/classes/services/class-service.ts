import { api } from '@/lib/api';

export interface Class {
    _id: string;
    name: string;
    sections: string[]; // Initially strings, can be expanded to objects if needed
}

export const fetchClasses = async (): Promise<Class[]> => {
    const response = await api.get('/classes');
    return response.data.data;
};

export const createClass = async (data: { name: string; sectionName?: string }) => {
    const response = await api.post('/classes', data);
    return response.data.data;
};
