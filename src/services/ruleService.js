import { apiClient, isMockApiEnabled, simulateDelay } from './apiClient';
import { mockStore } from '../mocks/store';

export const ruleService = {
  async getRules(params = {}) {
    if (isMockApiEnabled()) {
      await simulateDelay(200);
      let list = mockStore.getRules();

      if (params.category && params.category !== 'All') {
        list = list.filter((r) => r.category === params.category);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
        );
      }

      return { data: list, total: list.length };
    }
    return apiClient.get('/rules', { params });
  },

  async getRuleById(id) {
    if (isMockApiEnabled()) {
      await simulateDelay(150);
      const rule = mockStore.getRuleById(id);
      if (!rule) throw new Error(`Rule ${id} not found`);
      return { data: rule };
    }
    return apiClient.get(`/rules/${id}`);
  },

  async getRuleVersions(ruleId) {
    if (isMockApiEnabled()) {
      await simulateDelay(150);
      const rule = mockStore.getRuleById(ruleId);
      if (!rule) throw new Error(`Rule ${ruleId} not found`);
      return { data: rule.versions };
    }
    return apiClient.get(`/rules/${ruleId}/versions`);
  },

  async createRuleVersion(ruleId, versionData) {
    if (isMockApiEnabled()) {
      await simulateDelay(350);
      const updatedRule = mockStore.createRuleVersion(ruleId, versionData);
      return { data: updatedRule, message: 'New demonstration rule version created.' };
    }
    return apiClient.post(`/rules/${ruleId}/versions`, versionData);
  },
};
