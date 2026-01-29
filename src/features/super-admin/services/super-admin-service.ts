import { api } from '@/lib/api';

export interface DashboardStats {
    totalSchools: number;
    activeSchools: number;
    totalRevenue: number;
    activeStudents: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get('/super-admin/stats');
    return response.data.data;
};
