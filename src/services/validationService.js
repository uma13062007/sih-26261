import { apiClient, isMockApiEnabled, simulateDelay } from './apiClient';
import { mockStore } from '../mocks/store';

export const validationService = {
  async validateApplication(applicationId) {
    if (isMockApiEnabled()) {
      await simulateDelay(700);
      const result = mockStore.runValidation(applicationId);
      return { data: result };
    }
    return apiClient.post(`/applications/${applicationId}/validate`);
  },

  async getFindings(applicationId = null, params = {}) {
    if (isMockApiEnabled()) {
      await simulateDelay(250);
      let list = mockStore.getFindings(applicationId);

      if (params.severity && params.severity !== 'All') {
        list = list.filter((f) => f.severity === params.severity);
      }
      if (params.status && params.status !== 'All') {
        list = list.filter((f) => f.status === params.status);
      }

      return { data: list, total: list.length };
    }
    return apiClient.get(
      applicationId ? `/applications/${applicationId}/findings` : '/findings',
      { params }
    );
  },

  async getFindingById(findingId) {
    if (isMockApiEnabled()) {
      await simulateDelay(150);
      const f = mockStore.getFindingById(findingId);
      if (!f) throw new Error(`Finding ${findingId} not found`);
      return { data: f };
    }
    return apiClient.get(`/findings/${findingId}`);
  },
};
