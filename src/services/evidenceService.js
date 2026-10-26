import { apiClient, isMockApiEnabled, simulateDelay } from './apiClient';
import { mockStore } from '../mocks/store';

export const evidenceService = {
  async getFindingEvidence(findingId) {
    if (isMockApiEnabled()) {
      await simulateDelay(200);
      const finding = mockStore.getFindingById(findingId);
      if (!finding) throw new Error(`Finding ${findingId} not found`);

      return {
        data: {
          findingId: finding.id,
          applicationId: finding.applicationId,
          ruleId: finding.ruleId,
          title: finding.title,
          explanation: finding.explanation,
          recommendedAction: finding.recommendedAction,
          evidenceSources: finding.evidenceSources,
          status: finding.status,
          reviewerDecision: finding.reviewerDecision,
          reviewerNotes: finding.reviewerNotes,
        },
      };
    }
    return apiClient.get(`/findings/${findingId}/evidence`);
  },
};
