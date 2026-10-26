import { apiClient, isMockApiEnabled, simulateDelay } from './apiClient';
import { mockStore } from '../mocks/store';

export const reviewService = {
  async getReviews(params = {}) {
    if (isMockApiEnabled()) {
      await simulateDelay(250);
      let list = mockStore.getFindings();
      if (params.status && params.status !== 'All') {
        list = list.filter((f) => f.status === params.status);
      }
      if (params.severity && params.severity !== 'All') {
        list = list.filter((f) => f.severity === params.severity);
      }
      if (params.applicationId) {
        list = list.filter((f) => f.applicationId === params.applicationId);
      }
      return { data: list, total: list.length };
    }
    return apiClient.get('/reviews', { params });
  },

  async submitReview(findingId, payload) {
    if (isMockApiEnabled()) {
      await simulateDelay(300);
      const updated = mockStore.submitReviewAction(findingId, payload);
      return { data: updated, message: `Review action "${payload.action}" recorded.` };
    }
    return apiClient.post(`/findings/${findingId}/reviews`, payload);
  },
};
