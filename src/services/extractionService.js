import { apiClient, isMockApiEnabled, simulateDelay } from './apiClient';
import { mockStore } from '../mocks/store';

export const extractionService = {
  async getExtractedFields(applicationId) {
    if (isMockApiEnabled()) {
      await simulateDelay(250);
      const fields = mockStore.getExtractedFields(applicationId);
      return { data: fields };
    }
    return apiClient.get(`/applications/${applicationId}/fields`);
  },

  async triggerExtraction(applicationId) {
    if (isMockApiEnabled()) {
      await simulateDelay(800);
      const fields = mockStore.getExtractedFields(applicationId);
      mockStore.updateApplication(applicationId, { status: 'Extraction Completed' });
      return {
        data: fields,
        message: 'Extraction completed across all uploaded document pages.',
      };
    }
    return apiClient.post(`/applications/${applicationId}/extract`);
  },

  async confirmField(applicationId, fieldId) {
    if (isMockApiEnabled()) {
      await simulateDelay(200);
      const confirmed = mockStore.confirmExtractedField(applicationId, fieldId);
      return { data: confirmed, message: 'Extracted field confirmed manually.' };
    }
    return apiClient.post(`/applications/${applicationId}/fields/${fieldId}/confirm`);
  },
};
