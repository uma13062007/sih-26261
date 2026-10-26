import { apiClient, isMockApiEnabled, simulateDelay } from './apiClient';
import { mockStore } from '../mocks/store';

export const applicationService = {
  async getApplications(params = {}) {
    if (isMockApiEnabled()) {
      await simulateDelay(250);
      let list = mockStore.getApplications();

      if (params.search) {
        const query = params.search.toLowerCase();
        list = list.filter(
          (a) =>
            a.institutionName.toLowerCase().includes(query) ||
            a.id.toLowerCase().includes(query) ||
            a.institutionCode.toLowerCase().includes(query)
        );
      }

      if (params.status && params.status !== 'All') {
        list = list.filter((a) => a.status === params.status);
      }

      return {
        data: list,
        total: list.length,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      };
    }
    return apiClient.get('/applications', { params });
  },

  async getApplicationById(id) {
    if (isMockApiEnabled()) {
      await simulateDelay(200);
      const app = mockStore.getApplicationById(id);
      if (!app) {
        throw new Error(`Application ${id} not found`);
      }
      return { data: app };
    }
    return apiClient.get(`/applications/${id}`);
  },

  async createApplication(payload) {
    if (isMockApiEnabled()) {
      await simulateDelay(400);
      const newApp = mockStore.createApplication(payload);
      return { data: newApp, message: 'Application registered successfully' };
    }
    return apiClient.post('/applications', payload);
  },

  async updateApplication(id, updates) {
    if (isMockApiEnabled()) {
      await simulateDelay(250);
      const updated = mockStore.updateApplication(id, updates);
      return { data: updated };
    }
    return apiClient.put(`/applications/${id}`, updates);
  },
};
