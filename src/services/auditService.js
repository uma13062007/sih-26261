import { apiClient, isMockApiEnabled, simulateDelay } from './apiClient';
import { mockStore } from '../mocks/store';

export const auditService = {
  async getAuditEvents(filter = {}) {
    if (isMockApiEnabled()) {
      await simulateDelay(200);
      const events = mockStore.getAuditEvents(filter);
      return { data: events, total: events.length };
    }
    return apiClient.get('/audit', { params: filter });
  },
};
