import { api } from './apiService';
import { DashboardStatistics, RecentActivity, ChartData } from '../types/dashboard';


export const dashboardService = {
  async getStatistics(): Promise<DashboardStatistics> {
    const response = await api.get<DashboardStatistics>('/dashboard/statistics');
    return response.data;
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    const response = await api.get<RecentActivity[]>('/dashboard/recent-activity');
    return response.data;
  },

  async getChartsData(): Promise<ChartData> {
    const response = await api.get<ChartData>('/dashboard/charts-data');
    return response.data;
  },
};