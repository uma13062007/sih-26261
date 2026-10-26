import { apiClient, isMockApiEnabled, simulateDelay } from './apiClient';
import { mockStore } from '../mocks/store';

export const dashboardService = {
  async getDashboardSummary() {
    if (isMockApiEnabled()) {
      await simulateDelay(250);
      const summary = mockStore.getDashboardSummary();
      return { data: summary };
    }
    return apiClient.get('/dashboard/summary');
  },
};
