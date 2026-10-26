import { apiClient, isMockApiEnabled, simulateDelay } from './apiClient';
import { mockStore } from '../mocks/store';

export const documentService = {
  async getDocuments(applicationId) {
    if (isMockApiEnabled()) {
      await simulateDelay(200);
      const docs = mockStore.getDocuments(applicationId);
      return { data: docs };
    }
    return apiClient.get(`/applications/${applicationId}/documents`);
  },

  async markManuallyReviewed(applicationId, documentId) {
    if (isMockApiEnabled()) {
      await simulateDelay(180);
      const profile = (() => {
        try { return JSON.parse(localStorage.getItem('niyantran_demo_profile') || '{}'); }
        catch { return {}; }
      })();
      const data = mockStore.markDocumentManuallyReviewed(
        applicationId,
        documentId,
        profile.officerName || 'Demo Reviewer'
      );
      return { data, message: 'Manual review event recorded in the synthetic demo store.' };
    }
    return apiClient.post(`/applications/${applicationId}/documents/${documentId}/manual-verification`);
  },

  async uploadDocuments(applicationId, files) {
    if (isMockApiEnabled()) {
      await simulateDelay(600);
      const uploaded = mockStore.addDocuments(applicationId, files);
      return {
        data: uploaded,
        message: `${files.length} document(s) uploaded successfully.`,
      };
    }
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    return apiClient.post(`/applications/${applicationId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
